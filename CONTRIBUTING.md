# Contributing to lutherskills

Thanks for your interest. This project is a Claude Code plugin that teaches technical topics through interactive quizzes and hands-on challenges.

## Quick start

1. Fork + clone the repo.
2. Install the plugin locally for testing:
   ```bash
   /plugin marketplace add <your-fork-path>
   /plugin install lutherskills@<your-fork>
   ```
3. Edit skills under `skills/<skill-name>/SKILL.md`. Skills are plain Markdown with YAML frontmatter.

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/). The release pipeline (release-please) reads commit messages to decide version bumps and generate `CHANGELOG.md`.

- `feat: ...` — new feature (minor bump)
- `fix: ...` — bug fix (patch bump)
- `feat!: ...` or `BREAKING CHANGE:` in body — breaking change (major bump)
- `docs: ...`, `refactor: ...`, `ci: ...`, `chore: ...` — no bump, but `docs`/`refactor`/`ci` show up in changelog

Squash-merge PRs so the merged commit message drives the release.

## Adding a new topic

1. Update `skills/init/SKILL.md` — add topic option + sub-topic self-assessment questions + sub-topic list + mkdir line.
2. Update `skills/learn/SKILL.md` — add prereq chain under "Prerequisite Order".
3. `skills/quiz/SKILL.md` and `skills/progress/SKILL.md` are topic-agnostic — they read `profile.json` dynamically.
4. Consider adding a `challenges/<topic>/resources.md` template documenting curated primary sources.

## Testing a skill change

Skills are Markdown. The best test is to install the plugin in a scratch Claude Code session and run the affected slash command end-to-end. Verify:
- Skill frontmatter YAML is valid (name + description, max 1024 chars).
- Description starts with "Use when..." (describes triggering conditions, not workflow).
- No hardcoded topic lists in topic-agnostic skills.

## Pull requests

- Keep PRs focused — one logical change per PR.
- PR title follows conventional-commits format (it becomes the squash commit).
- Update `README.md` if you change user-visible behavior.
- CI will run automatically.

## Release process

Fully automated via [release-please](https://github.com/googleapis/release-please):
1. Merge PRs with conventional-commit titles.
2. release-please opens/updates a "release PR" with the next version + changelog entries.
3. Merging the release PR creates the tag, GitHub release, and bumps `plugin.json` + `package.json`.

Maintainers: do not bump versions manually.
