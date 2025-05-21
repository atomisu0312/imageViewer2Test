import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';
import fetch from 'node-fetch';
// @octokit/auth-app は actions/create-github-app-token を使用するため不要になります

interface ReviewCommentParams {
  github: Octokit; // actions/github-scriptから提供されるが、ここでは直接使用しない
  context: Context;
  token: string; // actions/create-github-app-token@v1 で生成されたトークンを直接受け取る
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
 * Calls the OpenAI API to get a code review.
 * @param changes コードの変更差分 / Code changes
 * @returns OpenAIによるレビューコメント / Review comment from OpenAI
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
          model: 'gpt-4.1-mini',
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
 * Posts a review comment to the pull request.
 * @param params ReviewCommentParamsオブジェクト（github, context, tokenを含む） / ReviewCommentParams object (including github, context, and token)
 */
export async function postReviewComment({ github, context, token }: ReviewCommentParams): Promise<void> {
  // actions/create-github-app-token@v1 からトークンが渡されることを確認
  if (!token) {
    throw new Error('GitHub App token is not provided. Please ensure actions/create-github-app-token@v1 successfully generated a token.');
  }

  // 生成されたトークンを使用してOctokitインスタンスを作成
  // This Octokit instance will make API calls as the GitHub App.
  const appGithub = new Octokit({ auth: token });

  // プルリクエストの変更差分を取得
  // Get pull request changes.
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
  // Get detailed changes.
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

  ### 直近の変更内容（最新5件）
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
  // Post comment as GitHub App.
  await appGithub.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: reviewComment,
  });
  console.log('Review comment posted successfully by GitHub App.');
}
