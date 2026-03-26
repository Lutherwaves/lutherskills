# LutherSkills — Interactive Learning Plugin for Claude Code

## Overview

A Claude Code plugin that turns Claude into a personalized learning engine for technical topics. It profiles your knowledge level, researches current material online, generates interactive quizzes and hands-on coding challenges, and tracks your progress — all within Claude Code and a dedicated learning repo.

**Architecture:** Modeled after `obra/superpowers` — a Claude Code plugin with auto-registered skills, publishable to skill.sh.

## Plugin Structure

```
lutherskills/
  package.json
  .claude-plugin/
    plugin.json
  .opencode/plugins/
    lutherskills.js           # Entry point — registers skills, injects bootstrap
  skills/
    init/SKILL.md             # Profile & workspace setup
    learn/SKILL.md            # Main learning engine
    progress/SKILL.md         # View stats & recommendations
    quiz/SKILL.md             # Quick standalone quiz sessions
    magic/SKILL.md            # Surprise challenges (deep-dive, fusion, reverse engineering)
  README.md
  LICENSE
```

### Plugin Loader (`lutherskills.js`)

Mirrors superpowers pattern:
- `config` hook to inject `skills/` path into Claude Code's skill discovery
- No system prompt injection needed (no bootstrap skill like using-superpowers)
- Simple frontmatter parser for SKILL.md files

## Skills

### 1. Init (`/lutherskills:init`)

**Purpose:** Profile the user and create their learning workspace.

**Flow:**

1. **Profile interview** (one question at a time):
   - Name/handle
   - Topics of interest (from supported list + free-form for future expansion)
   - Self-assessment per topic with sub-categories
   - Learning style: theory-first / hands-on-first / mixed
   - Time commitment: casual / regular / intense

2. **Repo creation** via `gh`:
   - Ask where to clone (default: `~/learning/`)
   - Generate 3 fun AI repo name suggestions based on profile (e.g., `ohms-and-oscillations`, `bitwise-battleground`, `packet-sorcery`)
   - User picks one or provides their own
   - `gh repo create` + clone + initialize structure:

```
<repo-name>/
  profile.json
  challenges/
    electrical-engineering/
    embedded-programming/
    networking/
    magic/
  projects/
  notes/
  .gitignore
```

3. **Baseline diagnostic quiz** — 5-10 questions per selected topic to calibrate actual level vs self-assessment

4. **Save repo path** in `profile.json` so other skills find the workspace

### 2. Learn (`/lutherskills:learn [topic]`)

**Purpose:** Main learning engine — research, teach, challenge, review, level up.

**Flow:**

1. **Load profile** — read `profile.json`, check current levels & sub-topic progress
2. **Topic selection** — if no arg, recommend based on:
   - Weakest areas first
   - Prerequisite ordering (GPIO before interrupts)
   - Staleness (topics not touched recently)
3. **Research phase** — WebSearch/WebFetch to:
   - Find accurate, level-appropriate content
   - Cross-reference multiple sources for accuracy
   - Pull datasheets/specs/RFCs when relevant
4. **Lesson delivery:**
   - Brief concept intro (~200 words, with source citations)
   - Comprehension check (2-3 inline multiple choice questions)
   - Hands-on challenge — creates file in `challenges/<topic>/`:
     - Problem description
     - Starter code or schematic prompt
     - Acceptance criteria
   - User writes solution in repo
   - Claude reviews, scores, gives feedback
5. **Level-up logic:**
   - Update `profile.json` with score and completion
   - Bump sub-topic level when enough challenges passed
   - Unlock next sub-topics when prerequisites met
6. **Session end** — commit progress, show summary

### 3. Quiz (`/lutherskills:quiz [topic] [count]`)

**Purpose:** Rapid-fire theory questions for quick sessions.

- Default: 10 questions from current level + a few stretch questions
- Optional topic filter and question count
- Tracks question number, correctness
- Updates `profile.json` scores at end

### 4. Progress (`/lutherskills:progress [topic]`)

**Purpose:** View learning stats and get recommendations.

- Per-topic level with sub-category breakdown
- Challenges completed / score averages
- Streak info (days active)
- "Recommended next" suggestions
- Optional topic arg for detailed view

### 5. Magic (`/lutherskills:magic`)

**Purpose:** Surprise challenges that make learning unpredictable and fun.

Randomly selects one of three modes:

- **Random deep-dive** — obscure, fascinating topic adjacent to current learning. Teaches it with a challenge. (e.g., "how floppy disk controllers accidentally became sound cards")
- **Cross-domain fusion** — combines two active topics into one unexpected challenge. (e.g., "debug this embedded system's network stack")
- **Reverse engineering** — drops a mystery artifact (code snippet, circuit description, packet dump) with zero context. User figures out what it does.

Each mode:
- Researches online for real-world inspiration
- Creates challenge in `challenges/magic/`
- Awards bonus "magic points" in profile
- Reveals backstory/real-world origin after solving

## Profile Schema (`profile.json`)

```json
{
  "name": "Luther",
  "handle": "lutherwaves",
  "created": "2026-03-27",
  "learning_style": "mixed",
  "time_commitment": "regular",
  "repo_path": "/home/user/learning/bitwise-battleground",
  "topics": {
    "electrical-engineering": {
      "level": "beginner",
      "sub_topics": {
        "fundamentals": { "level": "intermediate", "challenges_completed": 5, "avg_score": 0.85 },
        "analog-circuits": { "level": "beginner", "challenges_completed": 1, "avg_score": 0.7 },
        "digital-logic": { "level": "none", "challenges_completed": 0, "avg_score": 0 },
        "pcb-practical": { "level": "none", "challenges_completed": 0, "avg_score": 0 }
      }
    },
    "embedded-programming": {
      "level": "beginner",
      "sub_topics": {
        "c-fundamentals": { "level": "beginner", "challenges_completed": 0, "avg_score": 0 },
        "bare-metal": { "level": "none", "challenges_completed": 0, "avg_score": 0 },
        "peripherals": { "level": "none", "challenges_completed": 0, "avg_score": 0 },
        "rtos-concepts": { "level": "none", "challenges_completed": 0, "avg_score": 0 },
        "lower-level": { "level": "none", "challenges_completed": 0, "avg_score": 0 }
      }
    },
    "networking": {
      "level": "beginner",
      "sub_topics": {
        "fundamentals": { "level": "beginner", "challenges_completed": 0, "avg_score": 0 },
        "protocols": { "level": "none", "challenges_completed": 0, "avg_score": 0 },
        "hands-on": { "level": "none", "challenges_completed": 0, "avg_score": 0 },
        "infrastructure": { "level": "none", "challenges_completed": 0, "avg_score": 0 }
      }
    }
  },
  "stats": {
    "total_challenges": 6,
    "total_quizzes": 2,
    "magic_points": 0,
    "streak_days": 3,
    "last_active": "2026-03-27"
  }
}
```

## Supported Topics (v1)

### Electrical Engineering
| Sub-topic | Covers |
|-----------|--------|
| Fundamentals | Ohm's law, KVL/KCL, power, basic components |
| Analog circuits | Op-amps, filters, amplifiers, oscillators |
| Digital logic | Gates, flip-flops, state machines, timing |
| PCB/practical | Reading schematics, component selection, datasheets |

### Embedded Programming
| Sub-topic | Covers |
|-----------|--------|
| C fundamentals | Pointers, memory, structs, bit manipulation |
| Bare metal | Registers, GPIO, timers, interrupts |
| Peripherals | UART, SPI, I2C, ADC/DAC |
| RTOS concepts | Tasks, scheduling, synchronization |
| Lower level | Assembly basics, linker scripts, startup code |

### Networking
| Sub-topic | Covers |
|-----------|--------|
| Fundamentals | OSI model, TCP/IP stack, addressing |
| Protocols | HTTP, DNS, DHCP, ARP, ICMP |
| Hands-on | Socket programming in C, packet analysis |
| Infrastructure | Routing, switching, VLANs, subnetting |

Each sub-topic: **none -> beginner -> intermediate -> advanced**

## Level-Up Rules

- Complete 3+ challenges in a sub-topic with avg score >= 0.7 to level up
- Overall topic level = lowest common level across sub-topics (ensures breadth)
- Prerequisites: sub-topics unlock linearly within each topic (top-to-bottom in tables above)

## Extensibility

Adding a new topic domain requires:
1. Add topic + sub-topics to profile schema
2. No code changes — the learn/quiz/magic skills are topic-agnostic, they read the profile schema dynamically

## Technical Dependencies

- `gh` CLI — for repo creation
- `git` — for committing progress
- WebSearch/WebFetch — for researching learning content
- Claude Code plugin system — for skill registration

## Repository

- Source: `git@github.com:Lutherwaves/lutherskills.git`
- License: MIT
- Target: publishable to skill.sh
