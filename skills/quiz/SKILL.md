---
name: quiz
description: Use when you want a quick quiz session — rapid-fire multiple choice questions at your current level, good for 10-minute learning bursts
---

# Quiz — Quick Knowledge Check

## Overview

Rapid-fire multiple choice questions for quick learning sessions. No projects, no setup — just questions at your level with a few stretch questions mixed in.

## Usage

`/lutherskills:quiz` — 10 questions across all your topics
`/lutherskills:quiz embedded-programming` — 10 questions on embedded only
`/lutherskills:quiz networking 5` — 5 questions on networking
`/lutherskills:quiz golang-internals` — 10 questions on Go internals
`/lutherskills:quiz python-internals 5` — 5 questions on Python internals

Works with any topic in `profile.json` — no hardcoded list.

## Flow

### Step 1: Load Profile

Read `profile.json`. If not found, direct to `/lutherskills:init`.

Parse args:
- Topic filter (optional)
- Question count (optional, default 10)

### Step 2: Generate Questions

Use WebSearch to research current, accurate questions for the user's level:

- 70% questions at current level
- 20% stretch questions (one level above)
- 10% review questions (one level below, if applicable)
- Distribute across unlocked sub-topics within the filtered topic(s)
- All multiple choice: A/B/C/D
- Include one "trick" question that tests common misconceptions

### Step 3: Run Quiz

For each question:
1. Show: **"Question N/total — [Topic > Sub-topic]"**
2. Present the question with 4 options
3. Wait for answer
4. Reveal correct answer with brief explanation (1-2 sentences)
5. Track: correct/incorrect per sub-topic

### Step 4: Score & Update

Show results:
```
Quiz Complete!
Score: 7/10 (70%)

Breakdown:
  EE > Fundamentals:     3/3
  Embedded > Bare metal:  2/4
  Networking > Protocols:  2/3

Weakest area: Bare metal — consider running /lutherskills:learn embedded-programming
```

Update `profile.json`:
- `stats.total_quizzes += 1`
- Update `avg_score` per sub-topic (weight quiz scores at 0.5x vs challenge scores)
- Update `stats.last_active` and streak
- Level-up check (same rules as learn skill)

Commit:
```bash
git add profile.json
git commit -m "quiz: score [X]/[Y] across [topics]"
git push
```

## Common Mistakes

- Don't make all questions the same difficulty
- Don't skip the explanation after each answer — that's where learning happens
- Don't ask vague questions — every question should have one unambiguously correct answer
