const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const dayjs = require('dayjs');

const CHANGELOG_PATH = path.join(__dirname, '../../app/changelog/page.md');
const git = simpleGit();

async function updateChangelog() {
  const { latest } = await git.log({ n: 1 });

  if (!latest) {
    console.log('No commits found.');
    return;
  }

  // If the latest commit is from the bot, skip
  if (latest.message.includes('Update changelog')) {
    console.log('Latest commit is changelog update. Skipping.');
    return;
  }

  const today = dayjs();
  const todayMonthYear = today.format('MMMM YYYY'); // e.g., April 2025
  const todayDate = today.format('MMMM D, YYYY');   // e.g., April 28, 2025

  let changelog = '';
  if (fs.existsSync(CHANGELOG_PATH)) {
    changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  } else {
    changelog = '# Changelog\n\n';
  }

  const commitEntry = `- ${latest.message}`;

  // Ensure Month Section
  if (!changelog.includes(`## ${todayMonthYear}`)) {
    changelog = changelog.trim() + `\n\n## ${todayMonthYear}\n`;
  }

  // Ensure Day Section
  if (!changelog.includes(`### ${todayDate}`)) {
    changelog = changelog.replace(
      `## ${todayMonthYear}`,
      `## ${todayMonthYear}\n\n### ${todayDate}\n${commitEntry}\n`
    );
  } else {
    // If today's date exists, append new commit
    changelog = changelog.replace(
      `### ${todayDate}`,
      `### ${todayDate}\n${commitEntry}`
    );
  }

  fs.writeFileSync(CHANGELOG_PATH, changelog.trim() + '\n');
  console.log('Changelog updated.');
}

updateChangelog();
