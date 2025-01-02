# Rockford

A TypeScript homage to Boulder Dash. Pure Canvas implementation, no dependencies.

## Current Features
- 40x22 grid system with collision detection
- Basic level loading system
- Multi-environment support (Cave, Space, Underwater planned)
- Player movement with arrow keys
- Dirt, gems and walls implemented

## Quick Start
```bash
npm install
npm run dev
```

## Project Structure
```
src/
  ├── core/         
  │   └── levels/   # Level management and data
  ├── game/         # Core mechanics
  ├── scenes/       # Scene handling
  └── main.ts       
```

## Todo List

### Critical Path
- [ ] Digging through dirt
- [ ] Collecting gems
- [ ] Rock physics (falling, sliding)
- [ ] Level completion conditions
- [ ] Death conditions
- [ ] Score tracking

### Nice to Have
- [ ] Sound effects
- [ ] Multiple environments
- [ ] Save system
- [ ] Level editor
- [ ] Speed settings
- [ ] Smooth animations
- [ ] Mobile controls

### Polish
- [ ] Better sprites
- [ ] Environment-specific particles
- [ ] Screen shake
- [ ] Level transition effects
- [ ] Menu system
- [ ] High scores

## Contributing
PRs welcome. Keep it simple, keep it clean.

## Licence
MIT