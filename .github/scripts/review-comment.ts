import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';

interface ReviewCommentParams {
  github: Octokit;
  context: Context;
}

export async function postReviewComment({ github, context }: ReviewCommentParams): Promise<void> {
  const reviewComment = `
  ## 🤖 ボットレビュー

  こんにちは！プルリクエストを確認しました。
  コードの変更をありがとうございます！

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