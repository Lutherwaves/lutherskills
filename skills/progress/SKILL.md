---
name: progress
description: Use when you want to see your learning stats, current levels, completed challenges, streak info, and get recommendations for what to learn next
---

# Progress — Learning Dashboard

## Overview

View your learning stats and get personalized recommendations for what to study next.

## Usage

`/lutherskills:progress` — full overview
`/lutherskills:progress embedded-programming` — detailed view for one topic

## Flow

### Step 1: Load Profile

Read `profile.json`. If not found, direct to `/lutherskills:init`.

### Step 2: Display Stats

**Full overview (no topic arg):**

Iterate over every top-level topic present in `profile.json` — do NOT hardcode topic names. For each topic, render a section with its sub-topics in the order they appear in the file. Mark sub-topics as locked if their prereq (the one listed before them in the sub_topics object) hasn't reached "beginner".

```
=== LutherSkills Progress ===
Name: [name]
Active for: [days since created] days
Streak: [N] days
Last active: [date]

--- <Topic display name>: [overall level] ---
  <Sub-topic display name>:  [level] (####...... N challenges, avg 0.XX)
  ...

(repeat per topic in profile.json)

Totals: [N] challenges | [N] quizzes | [N] magic points
```

Display-name rule: convert `kebab-case` topic/sub-topic slugs to Title Case for display (e.g., `golang-internals` → "Go Internals", `gc-allocator` → "GC & Allocator"). Use natural English where slug is terse.

Progress bars: `#` = challenges completed out of 3 needed for level-up. 10 chars wide.

**Detailed view (topic arg):**
Show the same but with:
- List of completed challenges with scores
- Time spent per sub-topic (based on challenge dates)
- Specific recommendations for that topic

### Step 3: Recommendations

Based on profile analysis:

1. **Weakest unlocked sub-topic** — "Your weakest area is [X] at [level]. Consider `/lutherskills:learn [topic]`"
2. **Close to level-up** — "You need [N] more challenges in [X] to reach [next level]"
3. **Stale topics** — "You haven't touched [X] in [N] days"
4. **Stretch suggestion** — "Ready for a challenge? Try `/lutherskills:magic`"

## Common Mistakes

- Don't show locked sub-topics as if they're available — mark them as locked
- Show progress bars proportional to challenges needed for next level (3 challenges = full bar)
