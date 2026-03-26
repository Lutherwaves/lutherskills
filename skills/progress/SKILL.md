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

```
=== LutherSkills Progress ===
Name: [name]
Active for: [days since created] days
Streak: [N] days
Last active: [date]

--- Electrical Engineering: [overall level] ---
  Fundamentals:     [level] (####...... 5 challenges, avg 0.85)
  Analog circuits:  [level] (##........ 1 challenge, avg 0.70)
  Digital logic:    [locked/level]
  PCB/practical:    [locked/level]

--- Embedded Programming: [overall level] ---
  C fundamentals:   [level] (####...... 3 challenges, avg 0.80)
  Bare metal:       [level]
  Peripherals:      [locked/level]
  RTOS concepts:    [locked/level]
  Lower level:      [locked/level]

--- Networking: [overall level] ---
  Fundamentals:     [level]
  Protocols:        [locked/level]
  Hands-on:         [locked/level]
  Infrastructure:   [locked/level]

Totals: [N] challenges | [N] quizzes | [N] magic points
```

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
