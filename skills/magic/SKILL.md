---
name: magic
description: Use when you want a surprise learning challenge — randomly picks between deep-dive into obscure topics, cross-domain fusion challenges, or reverse engineering mysteries
---

# Magic — Surprise Challenges

## Overview

Unpredictable challenges that make learning fun. Each session randomly picks one of three modes, researches something fascinating, and drops you into it.

## Prerequisites

At least one topic at "beginner" level or above. Run `/lutherskills:init` first if needed.

## Flow

### Step 1: Load Profile

Read `profile.json`. Verify at least one sub-topic is at beginner+.

### Step 2: Pick Mode

Randomly select one of three modes. To add randomness, use the current timestamp's last digit: 0-3 = deep-dive, 4-6 = fusion (if 2+ topics active, else deep-dive), 7-9 = reverse engineering.

Check recent magic challenges in `challenges/magic/` to avoid repeating the same mode three times in a row.

### Step 3: Execute Mode

#### Mode 1: Random Deep-Dive

Pick an obscure, fascinating topic adjacent to something the user is learning. Research it online and create a "did you know?" lesson with a challenge.

Examples by topic:
- EE: "How a 555 timer was used to create the first drum machines"
- Embedded: "The story of the Therac-25 — when software bugs killed people"
- Networking: "How BGP hijacking accidentally rerouted YouTube through Pakistan"

Steps:
1. WebSearch for interesting/obscure facts related to user's active topics
2. Find the real story behind it
3. Create a lesson + challenge that teaches the underlying technical concept

Announce: **"Down the rabbit hole..."**

#### Mode 2: Cross-Domain Fusion

Combine two of the user's active topics into one challenge. Only available if user has 2+ active topics.

Examples:
- EE + Embedded: "Design a voltage level shifter circuit for UART between a 3.3V and 5V microcontroller"
- Embedded + Networking: "Implement a simple HTTP client on a bare-metal microcontroller (pseudocode)"
- EE + Networking: "Calculate the impedance matching needed for an Ethernet transformer"

Steps:
1. Identify intersection points between two active topics
2. WebSearch for real-world applications at that intersection
3. Create a challenge that requires knowledge from both domains

Announce: **"Where worlds collide..."**

#### Mode 3: Reverse Engineering

Drop a mystery artifact with zero context. The user figures out what it does.

Artifact types:
- **Code snippet**: Uncommented C code that does something non-obvious (e.g., bit-banged protocol, CRC implementation)
- **Circuit description**: Component list and connections — what does this circuit do?
- **Packet dump**: Hex dump of network traffic — what protocol, what's being communicated?

Steps:
1. WebSearch for interesting real-world examples at the user's level
2. Find something genuinely puzzling but solvable
3. Strip all context and present as mystery

Announce: **"What is this thing?"**

### Step 4: Create Challenge

Create challenge file: `challenges/magic/<mode>-<NNN>-<slug>.md`

Examples:
- `challenges/magic/deep-dive-001-555-drum-machines.md`
- `challenges/magic/fusion-001-uart-level-shifter.md`
- `challenges/magic/reverse-001-mystery-crc.md`

Challenge file includes:
- Mode type
- The lesson/story (for deep-dive) or context (for fusion) or artifact (for reverse engineering)
- The challenge itself
- Acceptance criteria
- NO hints — this is magic, figure it out

Tell the user what to do and where to write their solution.

### Step 5: Review & Reveal

After user submits solution:

1. Review against acceptance criteria
2. Score (same 0.0-1.0 scale as learn skill)
3. **Reveal the backstory:**
   - Deep-dive: the full story, why it matters, links to learn more
   - Fusion: how this applies in real-world engineering
   - Reverse engineering: what the artifact actually is, where it came from

The reveal is half the learning value — don't skip it.

### Step 6: Award Magic Points & Update

Award magic points based on score:
- 0.9+: 3 magic points
- 0.7-0.89: 2 magic points
- Below 0.7: 1 magic point (participation counts)

Update `profile.json`:
- `stats.magic_points += awarded`
- `stats.total_challenges += 1`
- `stats.last_active` and streak update
- Level-up check on relevant sub-topics

Commit and push:
```bash
git add challenges/magic/ profile.json
git commit -m "magic: [mode] — [slug], score [X], +[N] magic points"
git push
```

Show: **"+[N] magic points! Total: [total]. Next mystery awaits..."**

## Common Mistakes

- Don't pick topics way above the user's level — magic should be challenging but not impossible
- Don't reuse the same mode three times in a row
- Always reveal the backstory — that's half the learning value
- For reverse engineering, make sure the artifact is solvable with the user's current knowledge
