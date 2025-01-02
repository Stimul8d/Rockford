# Rockford

A modern TypeScript take on Boulder Dash. Pure canvas implementation, no faff.

## Run It
```bash
npm install
npm run dev
```

## What's Working
- Grid system with dirt, gems, rocks and walls
- Rock physics (falling and sliding)
- Smart enemies that spot you and give chase
- Multiple levels with different rules
- Clean architecture that's ready to expand

## Project Structure

### Core Game Files
```
src/
  ├── core/
  │   └── levels/
  │       ├── types.ts               - Level structure definitions
  │       ├── LevelManager.ts        - Handles level loading, transitions, resets
  │       └── data/
  │           ├── level1.ts          - Cave level layout and mechanics
  │           └── level2.ts          - Space level (different physics/rules)
  │
  ├── game/
  │   ├── Grid.ts                    - Core game grid: walls, dirt, collision
  │   ├── types.ts                   - Shared type definitions (positions etc)
  │   ├── EntityManager.ts           - Manages all moving objects, handles updates
  │   ├── Rockford.ts               - Player movement and interaction
  │   ├── PhysicsEngine.ts          - Boulder falling/sliding mechanics
  │   │
  │   └── enemies/
  │       ├── Enemy.ts              - Base enemy class: movement, drawing
  │       ├── behaviours/
  │       │   ├── Behaviour.ts      - Behaviour interface definition
  │       │   ├── TrappedBehaviour.ts - Cell patrolling, escape detection
  │       │   └── HuntBehaviour.ts   - Player tracking, pathfinding
  │       └── types/
  │           └── BasicEnemy.ts      - Standard enemy implementation
  │
  └── scenes/
      └── GameScene.ts              - Main game loop, coordinates everything
```

### Key Systems

#### Enemy Behaviour
- Enemies start trapped in cells, patrolling in a clockwise pattern
- They check for line of sight to player within 6 tiles
- Once they spot you through empty space, they switch to hunting
- Hunt mode uses proper pathfinding - they won't try to chase through walls

#### Physics Engine
- Handles rock falls and slides
- Checks for player crushing
- Chain reactions when multiple rocks fall
- Still needs work on complex cascades

#### Level System
- Each level defines its own layout
- Can tweak physics rules per environment
- Handles loading/resetting when you die
- Tracks completion state

### Known Issues
1. PhysicsEngine.ts needs better chain reactions
2. EntityManager.ts is getting bloated
3. GameScene.ts could use proper state management
4. Some edge cases in enemy pathfinding

### Next Up
1. More enemy types with different behaviours
2. Proper sound system
3. Better animations
4. Level editor
5. High scores

### Architecture Notes
- Built using composition over inheritance
- Each system properly separated
- Easy to extend with new behaviours
- Zero external dependencies

## Contributing
Fire in a PR if you want to help. Keep it clean, keep it simple.

## Licence
MIT