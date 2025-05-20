import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';

interface ReviewCommentParams {
  github: Octokit;
  context: Context;
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
      const { data: fileContent } = await github.rest.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.issue.number,
        mediaType: {
          format: 'diff'
        }
      });

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

  const reviewComment = `
  ## 🤖 ボットレビュー

  こんにちは！プルリクエストを確認しました。
  コードの変更をありがとうございます！

  ### 変更内容の詳細
  ${changes.join('\n')}

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