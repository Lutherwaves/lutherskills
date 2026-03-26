---
name: learn
description: Use when ready to learn — starts a focused session on a topic, researches current material online, teaches concepts, then creates hands-on coding challenges and reviews your solutions
---

# Learn — Interactive Learning Session

## Overview

The main learning engine. Picks a topic at your level, researches accurate content online, teaches the concept, then gives you a hands-on challenge to solve. Reviews your work and updates your progress.

## Usage

`/lutherskills:learn` — auto-pick best topic
`/lutherskills:learn embedded-programming` — specific topic
`/lutherskills:learn networking fundamentals` — specific sub-topic

## Flow

### Step 1: Load Profile

Read `profile.json` from the learning repo. If no repo found, tell user to run `/lutherskills:init` first.

Identify:
- Current levels per sub-topic
- Which sub-topics are unlocked (prerequisites met)
- What was last studied and when

### Step 2: Select Topic

If the user provided a topic arg:
- Use that topic
- Pick the lowest-level unlocked sub-topic within it

If no arg provided, recommend based on:
1. **Weakest areas** — sub-topics at lowest level
2. **Prerequisites met** — only suggest unlocked sub-topics
3. **Staleness** — prefer topics not touched in 3+ days
4. **Breadth** — rotate between topics to avoid tunnel vision

Present recommendation: **"I'd suggest [sub-topic] in [topic] — you're at [level] and it unlocks [next thing]. Sound good, or pick something else?"**

### Step 3: Research

Use WebSearch and WebFetch to find accurate, level-appropriate content:

1. Search for the sub-topic + level (e.g., "beginner SPI protocol tutorial embedded")
2. Find 2-3 quality sources (official docs, reputable tutorials, datasheets)
3. Cross-reference key facts between sources
4. For EE: find relevant component datasheets if applicable
5. For networking: find relevant RFCs or protocol specs if applicable
6. For embedded: find relevant register maps or reference manuals if applicable

**Important:** Cite sources in the lesson. Accuracy matters — wrong resistor values or protocol details can mislead.

### Step 4: Teach

Deliver a focused lesson:

1. **Concept intro** (~200 words max):
   - What is this and why does it matter?
   - Key principles with concrete examples
   - Cite sources: "According to [source], ..."

2. **Comprehension check** (2-3 inline multiple choice):
   - Ask one question at a time
   - Wait for answer before next question
   - Explain correct answer briefly if they get it wrong
   - These don't count toward level-up scoring

### Step 5: Hands-On Challenge

Create a challenge file in the learning repo:

**File:** `challenges/<topic>/<sub-topic>-<NNN>-<slug>.md`

Example: `challenges/embedded-programming/peripherals-001-uart-echo.md`

**Challenge file structure:**
```
# Challenge: [Title]
**Topic:** [topic] > [sub-topic]
**Level:** [beginner/intermediate/advanced]
**Date:** [YYYY-MM-DD]
**Sources:** [URLs used for research]

## Problem
[Clear problem description]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Starter Code
[If applicable — create a separate .c/.py/.txt file next to the challenge]

## Acceptance Criteria
[How Claude will evaluate the solution]

## Solution File
Write your solution in: `<filename>`
```

For code challenges, also create the starter file next to the challenge markdown.

Tell the user: **"Challenge created! Open [file path] and write your solution. Let me know when you're done and I'll review it."**

### Step 6: Review Solution

When the user says they're done:

1. Read their solution file
2. Evaluate against acceptance criteria
3. Score: 0.0 to 1.0 based on:
   - Correctness (50%)
   - Code quality / approach (25%)
   - Edge cases handled (25%)
4. Give specific feedback:
   - What worked well
   - What could improve
   - Key concept reinforcement if they missed something

### Step 7: Update Profile

Update `profile.json`:
- Increment `sub_topics.<sub-topic>.challenges_completed`
- Recalculate `sub_topics.<sub-topic>.avg_score` as rolling average
- Increment `stats.total_challenges`
- Update `stats.last_active` to today
- Update `stats.streak_days`: increment if last_active was yesterday, reset to 1 if gap > 1 day

**Level-up check:**
- 3+ challenges completed AND avg_score >= 0.7 → bump sub-topic level (none→beginner→intermediate→advanced)
- If all sub-topics at same minimum level → bump overall topic level
- If new sub-topics unlocked, announce: **"You've unlocked [sub-topic]!"**

### Step 8: Commit & Summary

```bash
git add challenges/ profile.json
git commit -m "learn: complete [sub-topic] challenge — score [X]"
git push
```

Show session summary:
- Topic/sub-topic covered
- Score
- Current level
- What's unlocked next
- Suggested next session

## Prerequisite Order

Sub-topics unlock top-to-bottom within each topic:

**Electrical Engineering:** fundamentals → analog-circuits → digital-logic → pcb-practical
**Embedded Programming:** c-fundamentals → bare-metal → peripherals → rtos-concepts → lower-level
**Networking:** fundamentals → protocols → hands-on → infrastructure

A sub-topic unlocks when the one above it reaches "beginner" level.
The first sub-topic in each topic is always unlocked.

## Common Mistakes

- Don't skip the research phase — stale knowledge leads to bad challenges
- Don't give challenges above the user's level — frustration kills motivation
- Always cite sources in the lesson
- Don't auto-advance without the user confirming they're ready
