import { Octokit } from '@octokit/rest';

const github = new Octokit({ auth: process.env.GH_TOKEN });

const prNumber = context.payload.pull_request.number;

const { data: files } = await github.rest.pulls.listFiles({
  owner: context.repo.owner,
  repo: context.repo.repo,
  pull_number: prNumber,
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
console.log(changes);