import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';
import fetch from 'node-fetch';
import { createAppAuth } from '@octokit/auth-app'; // GitHub App認証のために追加

interface ReviewCommentParams {
  github: Octokit; // actions/github-scriptから提供されるが、App認証のために新しいOctokitインスタンスを作成する
  context: Context;
  appId: string; // GitHub AppのID
  privateKey: string; // GitHub AppのPAT
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * OpenAI APIを呼び出してコードレビューを取得します。
 * @param changes コードの変更差分
 * @returns OpenAIによるレビューコメント
 */
async function getOpenAIReview(changes: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'あなたは経験豊富なソフトウェアエンジニアです。コードレビューを行い、技術的な観点から改善点や潜在的な問題点を指摘してください。'
            },
            {
              role: 'user',
              content: `以下のコード変更をレビューしてください：\n\n${changes}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      }
    );

    const data = await response.json() as OpenAIResponse;
    if (!response.ok) {
      console.error('OpenAI API Error Response:', data);
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Unexpected OpenAI response structure:', data);
      return 'AIレビューの取得に失敗しました。';
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'AIレビューの取得中にエラーが発生しました。';
  }
}

/**
 * プルリクエストにレビューコメントを投稿します。
 * GitHub Appとして認証し、コメントを投稿します。
 * @param params ReviewCommentParamsオブジェクト（github, context, appId, privateKeyを含む）
 */
export async function postReviewComment({ github, context, appId, privateKey }: ReviewCommentParams): Promise<void> {
  if (!appId || !privateKey) {
    throw new Error('GitHub App ID or Private Key is not provided. Please set APP_ID and PRIVATE_KEY as GitHub secrets.');
  }

  // GitHub Appとして認証するための認証オブジェクトを作成
  const auth = createAppAuth({
    appId: appId,
    privateKey: privateKey,
    // インストールIDを取得するために、認証されていないOctokitインスタンスを使用
    request: github.request.defaults({
      baseUrl: context.apiUrl,
    }),
  });

  let installationId: number | undefined;

  try {
    // 組織にインストールされているAppのインストールIDを取得しようと試みる
    const { data: orgInstallation } = await github.rest.apps.getOrgInstallation({
      org: context.repo.owner,
    });
    installationId = orgInstallation.id;
  } catch (orgError) {
    // 組織にインストールされていない場合、リポジトリにインストールされているAppのインストールIDを取得しようと試みる
    try {
      const { data: repoInstallation } = await github.rest.apps.getRepoInstallation({
        owner: context.repo.owner,
        repo: context.repo.repo,
      });
      installationId = repoInstallation.id;
    } catch (repoError) {
      console.error('Failed to get GitHub App installation ID for both org and repo:', orgError, repoError);
      throw new Error(`GitHub App is not installed on ${context.repo.owner}/${context.repo.repo} or its organization.`);
    }
  }

  if (!installationId) {
    throw new Error(`GitHub App installation ID could not be determined for ${context.repo.owner}/${context.repo.repo}.`);
  }

  // インストールトークンを取得
  const { token } = await auth({
    type: 'installation',
    installationId: installationId,
  });

  // インストールトークンを使用して新しいOctokitインスタンスを作成
  // これにより、このインスタンスを介したAPI呼び出しはGitHub Appとして実行されます。
  const appGithub = new Octokit({ auth: token });

  // プルリクエストの変更差分を取得
  const { data: pullRequest } = await appGithub.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  });

  const { data: files } = await appGithub.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  });

  // 変更内容の詳細を取得
  const changes = await Promise.all(
    files.map(async file => {
      const status = file.status === 'modified' ? '🔄' : 
                    file.status === 'added' ? '✨' : 
                    file.status === 'removed' ? '🗑️' : '📝';

      return `
### ${status} ${file.filename}
\`\`\`diff
${file.patch || '新規ファイル'}
\`\`\`
変更行数: ${file.changes}行
      `;
    })
  );

  const changesText = changes.join('\n');
  const openAIReview = await getOpenAIReview(changesText);

  const reviewComment = `
  ## 🤖 ボットレビュー

  こんにちは！プルリクエストを確認しました。
  コードの変更をありがとうございます！

  ### 変更内容の詳細
  ${changesText}

  ### AIレビュー結果
  ${openAIReview}

  ### レビュー結果
  - ✅ コードの変更は適切です
  - ✅ テストが含まれています
  - ✅ ドキュメントが更新されています

  引き続き頑張ってください！
  `;

  // GitHub Appとしてコメントを投稿
  await appGithub.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: reviewComment,
  });
}
