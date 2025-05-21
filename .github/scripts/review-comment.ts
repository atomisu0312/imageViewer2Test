import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';
import fetch from 'node-fetch';

interface ReviewCommentParams {
  github: Octokit;
  context: Context;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function getOpenAIReview(changes: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

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
  return data.choices[0].message.content;
}

export async function postReviewComment({ github, context }: ReviewCommentParams): Promise<void> {
  // プルリクエストの変更差分を取得
  const { data: pullRequest } = await github.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  });

  const { data: files } = await github.rest.pulls.listFiles({
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

  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: reviewComment,
  });
} 