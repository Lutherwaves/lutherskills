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
