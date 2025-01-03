import { State, StateType } from './State';
import { PlayingState } from './PlayingState';
import { TimeUpState } from './TimeUpState';
import { DeadState } from './DeadState';
import { CompleteState } from './CompleteState';

export type GameData = {
    score: number;
    gemsCollected: number;
    timeRemaining: number;
    totalGems: number;
};

export class StateManager {
    private states: Map<StateType, State> = new Map();
    private currentState: State | null = null;
    private currentStateType: StateType | null = null;
    private gameData: GameData = {
        score: 0,
        gemsCollected: 0,
        timeRemaining: 150,
        totalGems: 12
    };

    constructor() {
        this.states.set(StateType.Playing, new PlayingState(this));
        this.states.set(StateType.TimeUp, new TimeUpState(this));
        this.states.set(StateType.Dead, new DeadState(this));
        this.states.set(StateType.Complete, new CompleteState(this));
    }

    switchState(type: StateType) {
        if (this.currentState) {
            this.currentState.exit();
        }

        const newState = this.states.get(type);
        if (!newState) {
            throw new Error(`State ${type} not found`);
        }

        this.currentState = newState;
        this.currentStateType = type;
        this.currentState.enter();
    }

    updateGameData(data: Partial<GameData>) {
        this.gameData = { ...this.gameData, ...data };
    }

    getGameData(): GameData {
        return this.gameData;
    }

    getCurrentState(): State | null {
        return this.currentState;
    }

    getStateType(): StateType | null {
        return this.currentStateType;
    }

    resetLevel() {
        this.gameData = {
            score: 0,
            gemsCollected: 0,
            timeRemaining: 150,
            totalGems: 12
        };
    }
}