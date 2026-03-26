# LutherSkills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Claude Code plugin that turns Claude into a personalized learning engine for embedded programming, electrical engineering, and networking.

**Architecture:** Claude Code plugin mirroring obra/superpowers — JS entry point registers a `skills/` directory, each skill is a `SKILL.md` with YAML frontmatter. Learning state lives in a user-created GitHub repo with `profile.json`. Skills use WebSearch/WebFetch for research, create challenge files in the repo, and update the profile on completion.

**Tech Stack:** Claude Code plugin system, JavaScript (ES modules), `gh` CLI, `git`, WebSearch/WebFetch tools

---

## File Structure

```
lutherskills/
  package.json                          # NPM manifest, main -> plugin loader
  .claude-plugin/
    plugin.json                         # Plugin metadata for Claude Code
  .opencode/plugins/
    lutherskills.js                     # Entry point — registers skills dir
  skills/
    init/SKILL.md                       # Profile & workspace setup
    learn/SKILL.md                      # Main learning engine
    quiz/SKILL.md                       # Quick quiz sessions
    progress/SKILL.md                   # View stats & recommendations
    magic/SKILL.md                      # Surprise challenges
  README.md
  LICENSE
```

---

### Task 1: Plugin Scaffold — package.json, plugin.json, entry point

**Files:**
- Create: `package.json`
- Create: `.claude-plugin/plugin.json`
- Create: `.opencode/plugins/lutherskills.js`
- Create: `LICENSE`
- Create: `README.md`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "lutherskills",
  "version": "0.1.0",
  "type": "module",
  "main": ".opencode/plugins/lutherskills.js"
}
```

- [ ] **Step 2: Create `.claude-plugin/plugin.json`**

```json
{
  "name": "lutherskills",
  "description": "Interactive learning engine for embedded programming, electrical engineering, and networking — profile your level, get quizzed, solve hands-on challenges, level up",
  "version": "0.1.0",
  "author": {
    "name": "Lutherwaves"
  },
  "homepage": "https://github.com/Lutherwaves/lutherskills",
  "repository": "https://github.com/Lutherwaves/lutherskills",
  "license": "MIT",
  "keywords": [
    "learning",
    "embedded",
    "electrical-engineering",
    "networking",
    "skills",
    "interactive",
    "quizzes"
  ]
}
```

- [ ] **Step 3: Create `.opencode/plugins/lutherskills.js`**

```javascript
/**
 * LutherSkills plugin for Claude Code
 *
 * Auto-registers skills directory via config hook.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const LutherSkillsPlugin = async ({ client, directory }) => {
  const lutherskillsSkillsDir = path.resolve(__dirname, '../../skills');

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(lutherskillsSkillsDir)) {
        config.skills.paths.push(lutherskillsSkillsDir);
      }
    }
  };
};
```

- [ ] **Step 4: Create `LICENSE`**

MIT license file with "Lutherwaves" as copyright holder, year 2026.

- [ ] **Step 5: Create `README.md`**

```markdown
# lutherskills

Interactive learning engine for Claude Code. Learn embedded programming, electrical engineering, and networking through personalized quizzes and hands-on challenges.

## Install

```bash
claude plugin add Lutherwaves/lutherskills
```

## Skills

- `/lutherskills:init` — Set up your profile and learning workspace
- `/lutherskills:learn [topic]` — Start a learning session
- `/lutherskills:quiz [topic] [count]` — Quick quiz session
- `/lutherskills:progress [topic]` — View your stats and recommendations
- `/lutherskills:magic` — Surprise challenge (deep-dive, fusion, or reverse engineering)

## Topics (v1)

- Electrical Engineering
- Embedded Programming
- Networking
```

- [ ] **Step 6: Commit**

```bash
git add package.json .claude-plugin/plugin.json .opencode/plugins/lutherskills.js LICENSE README.md
git commit -m "feat: scaffold plugin with entry point and metadata"
```

---

### Task 2: Init Skill — Profile Interview & Repo Creation

**Files:**
- Create: `skills/init/SKILL.md`

- [ ] **Step 1: Create `skills/init/SKILL.md`**

```markdown
---
name: init
description: Use when setting up lutherskills for the first time — profiles your knowledge level, creates a learning workspace repo via gh, and runs a baseline diagnostic quiz
---

# Init — Profile & Workspace Setup

## Overview

Set up your personalized learning environment. This skill interviews you, creates a GitHub repo as your workspace, and calibrates your starting levels with a diagnostic quiz.

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- `git` configured

## Flow

### Step 1: Check Prerequisites

Before anything else, verify:
```bash
gh auth status
git config user.name
```

If `gh` is not authenticated, tell the user to run `gh auth login` first.

### Step 2: Profile Interview

Ask these questions **one at a time**, wait for each answer:

1. **"What name or handle should I use for your profile?"**

2. **"Which topics are you interested in learning?"**
   Options (multi-select):
   - A) Electrical Engineering
   - B) Embedded Programming
   - C) Networking
   - D) All of the above
   (Also accept free-form topics — store them for future expansion)

3. **For each selected topic, ask sub-topic self-assessment:**

   For Electrical Engineering:
   - "How would you rate yourself in EE fundamentals (Ohm's law, KVL/KCL, basic components)? none / beginner / intermediate / advanced"
   - "Analog circuits (op-amps, filters, amplifiers)?"
   - "Digital logic (gates, flip-flops, state machines)?"
   - "PCB/practical (schematics, component selection, datasheets)?"

   For Embedded Programming:
   - "C fundamentals (pointers, memory, structs, bit manipulation)?"
   - "Bare metal (registers, GPIO, timers, interrupts)?"
   - "Peripherals (UART, SPI, I2C, ADC/DAC)?"
   - "RTOS concepts (tasks, scheduling, synchronization)?"
   - "Lower level (assembly, linker scripts, startup code)?"

   For Networking:
   - "Fundamentals (OSI model, TCP/IP, addressing)?"
   - "Protocols (HTTP, DNS, DHCP, ARP, ICMP)?"
   - "Hands-on (socket programming, packet analysis)?"
   - "Infrastructure (routing, switching, VLANs, subnetting)?"

4. **"How do you prefer to learn?"**
   - A) Theory first, then practice
   - B) Hands-on first, theory as needed
   - C) Mixed — alternate between both

5. **"How much time do you want to commit?"**
   - A) Casual — a few sessions per week
   - B) Regular — most days
   - C) Intense — daily deep sessions

### Step 3: Create Learning Repo

1. Ask: **"Where should I create your learning workspace? (default: ~/learning/)"**

2. Generate 3 fun repo name suggestions based on the user's profile. Examples:
   - If EE-focused: `spark-and-solder`, `ohms-playground`, `circuit-dojo`
   - If embedded-focused: `bitwise-battleground`, `register-rumble`, `bare-metal-forge`
   - If networking-focused: `packet-sorcery`, `subnet-ninja`, `protocol-dungeon`
   - If mixed: `electron-hacker-lab`, `signal-to-noise`, `full-stack-voltage`

   Ask: **"Pick a repo name or suggest your own:"** then list the 3 suggestions.

3. Create the repo:
```bash
gh repo create <repo-name> --public --clone --description "My lutherskills learning workspace"
cd <repo-name>
```

4. Initialize the workspace structure:

Create `profile.json`:
```json
{
  "name": "<user's name>",
  "handle": "<user's handle>",
  "created": "<today's date YYYY-MM-DD>",
  "learning_style": "<theory-first|hands-on-first|mixed>",
  "time_commitment": "<casual|regular|intense>",
  "repo_path": "<absolute path to repo>",
  "topics": {
    "<topic-id>": {
      "level": "none",
      "sub_topics": {
        "<sub-topic-id>": {
          "level": "<self-assessed level>",
          "challenges_completed": 0,
          "avg_score": 0
        }
      }
    }
  },
  "stats": {
    "total_challenges": 0,
    "total_quizzes": 0,
    "magic_points": 0,
    "streak_days": 0,
    "last_active": "<today's date>"
  }
}
```

Only include topics the user selected. Sub-topic structure per topic:

**electrical-engineering:** fundamentals, analog-circuits, digital-logic, pcb-practical
**embedded-programming:** c-fundamentals, bare-metal, peripherals, rtos-concepts, lower-level
**networking:** fundamentals, protocols, hands-on, infrastructure

Create directories:
```bash
mkdir -p challenges/electrical-engineering challenges/embedded-programming challenges/networking challenges/magic projects notes
```

Create `.gitignore`:
```
.DS_Store
*.swp
*~
```

5. Initial commit:
```bash
git add -A
git commit -m "feat: initialize learning workspace"
git push -u origin main
```

### Step 4: Baseline Diagnostic Quiz

For each selected topic, run a 5-question diagnostic quiz to calibrate levels:

- Questions should span the sub-topics at beginner level
- Use multiple choice (A/B/C/D)
- Ask one question at a time
- Track correct/incorrect

After the quiz, adjust `profile.json` sub-topic levels:
- 0-1 correct in a sub-topic area → keep at "none"
- 2-3 correct → set to "beginner"
- 4+ correct → set to "intermediate"

Update and commit:
```bash
git add profile.json
git commit -m "feat: calibrate initial levels from diagnostic"
git push
```

### Step 5: Welcome Message

Show a summary:
- Profile overview
- Starting levels per topic
- Suggested first `/lutherskills:learn` topic based on levels

## Common Mistakes

- Don't skip the diagnostic — self-assessment is often inaccurate
- Don't create the repo without `gh auth status` passing first
- Always commit after profile changes
```

- [ ] **Step 2: Commit**

```bash
git add skills/init/SKILL.md
git commit -m "feat: add init skill — profile interview, repo creation, diagnostic quiz"
```

---

### Task 3: Learn Skill — Main Learning Engine

**Files:**
- Create: `skills/learn/SKILL.md`

- [ ] **Step 1: Create `skills/learn/SKILL.md`**

```markdown
---
name: learn
description: Use when ready to learn — starts a focused session on a topic, researches current material online, teaches concepts, then creates hands-on coding challenges and reviews your solutions
---

# Learn — Interactive Learning Session

## Overview

The main learning engine. Picks a topic at your level, researches accurate content online, teaches the concept, then gives you a hands-on challenge to solve. Reviews your work and updates your progress.

## Flow

### Step 1: Load Profile

Read `profile.json` from the learning repo. If no repo found, tell user to run `/lutherskills:init` first.

Identify:
- Current levels per sub-topic
- Which sub-topics are unlocked (prerequisites met)
- What was last studied and when

### Step 2: Select Topic

If the user provided a topic arg (e.g., `/lutherskills:learn embedded-programming`):
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
```markdown
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

For code challenges, also create the starter file:
`challenges/<topic>/<sub-topic>-<NNN>-<slug>.<ext>`

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
```json
{
  "sub_topics.<sub-topic>.challenges_completed": "+1",
  "sub_topics.<sub-topic>.avg_score": "recalculate rolling average",
  "stats.total_challenges": "+1",
  "stats.last_active": "today",
  "stats.streak_days": "increment if last_active was yesterday, reset if gap > 1 day"
}
```

**Level-up check:**
- 3+ challenges completed AND avg_score >= 0.7 → bump sub-topic level
- If all sub-topics at same level → bump overall topic level
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

## Common Mistakes

- Don't skip the research phase — stale knowledge leads to bad challenges
- Don't give challenges above the user's level — frustration kills motivation
- Always cite sources in the lesson
- Don't auto-advance without the user confirming they're ready
```

- [ ] **Step 2: Commit**

```bash
git add skills/learn/SKILL.md
git commit -m "feat: add learn skill — research, teach, challenge, review, level-up"
```

---

### Task 4: Quiz Skill — Rapid-Fire Questions

**Files:**
- Create: `skills/quiz/SKILL.md`

- [ ] **Step 1: Create `skills/quiz/SKILL.md`**

```markdown
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
  EE > Fundamentals:     3/3 ✓
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
```

- [ ] **Step 2: Commit**

```bash
git add skills/quiz/SKILL.md
git commit -m "feat: add quiz skill — rapid-fire questions with scoring"
```

---

### Task 5: Progress Skill — Stats & Recommendations

**Files:**
- Create: `skills/progress/SKILL.md`

- [ ] **Step 1: Create `skills/progress/SKILL.md`**

```markdown
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
Streak: [N] days 🔥
Last active: [date]

--- Electrical Engineering: [overall level] ---
  Fundamentals:     [level] (█████░░░░░ 5 challenges, avg 0.85)
  Analog circuits:  [level] (██░░░░░░░░ 1 challenge, avg 0.70)
  Digital logic:    [locked/level]
  PCB/practical:    [locked/level]

--- Embedded Programming: [overall level] ---
  C fundamentals:   [level] (████░░░░░░ 3 challenges, avg 0.80)
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

- Don't show locked sub-topics as if they're available
- Show progress bars proportional to challenges needed for next level (3 challenges = full bar)
```

- [ ] **Step 2: Commit**

```bash
git add skills/progress/SKILL.md
git commit -m "feat: add progress skill — stats dashboard and recommendations"
```

---

### Task 6: Magic Skill — Surprise Challenges

**Files:**
- Create: `skills/magic/SKILL.md`

- [ ] **Step 1: Create `skills/magic/SKILL.md`**

```markdown
---
name: magic
description: Use when you want a surprise learning challenge — randomly picks between deep-dive into obscure topics, cross-domain fusion challenges, or reverse engineering mysteries
---

# Magic — Surprise Challenges

## Overview

Unpredictable challenges that make learning fun. Each session randomly picks one of three modes, researches something fascinating, and drops you into it.

## Flow

### Step 1: Load Profile

Read `profile.json`. If not found, direct to `/lutherskills:init`.
Need at least one topic at "beginner" level to use magic.

### Step 2: Pick Mode

Randomly select one of three modes (use current timestamp or similar for randomness):

**Mode 1: Random Deep-Dive**
Pick an obscure, fascinating topic adjacent to something the user is learning. Research it online and create a "did you know?" lesson with a challenge.

Examples by topic:
- EE: "How a 555 timer was used to create the first drum machines"
- Embedded: "The story of the Therac-25 — when software bugs killed people"
- Networking: "How BGP hijacking accidentally rerouted YouTube through Pakistan"

Research steps:
1. WebSearch for interesting/obscure facts related to user's active topics
2. Find the real story behind it
3. Create a lesson + challenge that teaches the underlying technical concept

**Mode 2: Cross-Domain Fusion**
Combine two of the user's active topics into one challenge. Only available if user has 2+ topics.

Examples:
- EE + Embedded: "Design a voltage level shifter circuit for UART between a 3.3V and 5V microcontroller"
- Embedded + Networking: "Implement a simple HTTP client on a bare-metal microcontroller (pseudocode)"
- EE + Networking: "Calculate the impedance matching needed for an Ethernet transformer"

Research steps:
1. Identify intersection points between two active topics
2. WebSearch for real-world applications at that intersection
3. Create a challenge that requires knowledge from both domains

**Mode 3: Reverse Engineering**
Drop a mystery artifact with zero context. The user figures out what it does.

Artifact types:
- **Code snippet**: Uncommented C code that does something non-obvious (e.g., bit-banged protocol, CRC implementation)
- **Circuit description**: Component list and connections — what does this circuit do?
- **Packet dump**: Hex dump of network traffic — what protocol, what's being communicated?

Research steps:
1. WebSearch for interesting real-world examples
2. Find something at the user's level that's genuinely puzzling
3. Strip all context and present as mystery

### Step 3: Present Challenge

Announce the mode with flair:
- Deep-dive: **"🎩 DEEP DIVE — Down the rabbit hole..."**
- Fusion: **"⚡ FUSION — Where worlds collide..."**
- Reverse engineering: **"🔍 MYSTERY — What is this thing?"**

Create challenge file: `challenges/magic/<mode>-<NNN>-<slug>.md`

Challenge file includes:
- Mode type
- The lesson/story (for deep-dive) or context (for fusion)
- The challenge itself
- NO hints (this is magic — figure it out)

### Step 4: Review & Reveal

After user submits solution:
1. Review against acceptance criteria
2. Score (same as learn skill)
3. **Reveal the backstory:**
   - Deep-dive: the full story, why it matters, links to learn more
   - Fusion: how this applies in real-world engineering
   - Reverse engineering: what the artifact actually is, where it came from

### Step 5: Award Magic Points & Update

- Award magic points based on score:
  - 0.9+: 3 magic points
  - 0.7-0.89: 2 magic points
  - Below 0.7: 1 magic point (participation counts)
- Update `profile.json` stats
- Commit and push

```bash
git add challenges/magic/ profile.json
git commit -m "magic: [mode] — [slug], score [X], +[N] magic points"
git push
```

Show: **"✨ +[N] magic points! Total: [total]. Next mystery awaits..."**

## Common Mistakes

- Don't pick topics way above the user's level — magic should be challenging but not impossible
- Don't reuse the same mode three times in a row — check recent magic challenges
- Always reveal the backstory — that's half the learning value
- For reverse engineering, make sure the artifact is solvable with the user's current knowledge
```

- [ ] **Step 2: Commit**

```bash
git add skills/magic/SKILL.md
git commit -m "feat: add magic skill — deep-dive, fusion, and reverse engineering challenges"
```

---

### Task 7: Final Integration — Push to GitHub

**Files:**
- No new files

- [ ] **Step 1: Verify all files exist**

```bash
ls -la package.json .claude-plugin/plugin.json .opencode/plugins/lutherskills.js LICENSE README.md
ls skills/*/SKILL.md
```

Expected: all 5 skill SKILL.md files, plugin infrastructure, README, LICENSE.

- [ ] **Step 2: Test plugin loads**

Verify the JS entry point has no syntax errors:
```bash
node -e "import('./.opencode/plugins/lutherskills.js').then(m => console.log('OK:', Object.keys(m)))"
```

Expected: `OK: [ 'LutherSkillsPlugin' ]`

- [ ] **Step 3: Push to GitHub**

```bash
git push -u origin main
```

- [ ] **Step 4: Verify on GitHub**

```bash
gh repo view Lutherwaves/lutherskills --web
```
