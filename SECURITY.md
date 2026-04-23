# Security Policy

## Supported Versions

Only the latest minor version receives security fixes.

| Version | Supported |
|---------|-----------|
| 0.2.x   | ✅        |
| < 0.2   | ❌        |

## Reporting a Vulnerability

Please report security issues privately via GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability).

Do not open a public issue for security reports.

**What to include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested remediation (if known)

**Response time:** We aim to acknowledge reports within 72 hours and provide a fix or mitigation plan within 14 days for confirmed issues.

## Scope

This plugin runs inside Claude Code and executes shell commands (e.g., `git`, `gh`, file I/O) on the user's machine as part of its normal flow. Specifically relevant to security reviews:

- Skill files in `skills/*/SKILL.md` — treated as trusted content by Claude Code
- Shell commands documented within SKILL.md instructions
- File-write patterns (profile.json, challenge files, learning repo contents)

Out of scope:
- User-authored learning-workspace content
- Third-party Claude Code harness behavior
