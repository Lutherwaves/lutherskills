# lutherskills

[![Release](https://github.com/Lutherwaves/lutherskills/actions/workflows/release.yml/badge.svg)](https://github.com/Lutherwaves/lutherskills/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org)

Interactive learning engine for Claude Code. Learn embedded programming, electrical engineering, networking, and programming language internals (Go, Python, TypeScript, JS engines) through personalized quizzes and hands-on challenges.

## Install

```bash
# Step 1: Add the marketplace
/plugin marketplace add Lutherwaves/lutherskills

# Step 2: Install the plugin
/plugin install lutherskills@Lutherwaves-lutherskills
```

## Skills

- `/lutherskills:init` — Set up your profile and learning workspace
- `/lutherskills:learn [topic]` — Start a learning session
- `/lutherskills:quiz [topic] [count]` — Quick quiz session
- `/lutherskills:progress [topic]` — View your stats and recommendations
- `/lutherskills:magic` — Surprise challenge (deep-dive, fusion, or reverse engineering)

## Topics

**Hardware & systems (v0.1)**
- Electrical Engineering — fundamentals, analog circuits, digital logic, PCB/practical
- Embedded Programming — C fundamentals, bare metal, peripherals, RTOS, lower level
- Networking — fundamentals, protocols, hands-on, infrastructure

**Language internals (v0.2)**
- Go Internals — fundamentals, runtime (GMP/scheduler), GC & allocator, compiler & SSA
- Python Internals — fundamentals, bytecode & ceval, GC & GIL, C extensions
- TypeScript Internals — fundamentals, compiler pipeline, type system, tooling
- JS Engine Internals — fundamentals, V8 objects, JIT pipeline, GC

Language-internals topics favor reading real runtime/compiler source and implementing minimal toy versions over multiple-choice. See `challenges/<topic>/resources.md` in your learning workspace for curated primary sources.
