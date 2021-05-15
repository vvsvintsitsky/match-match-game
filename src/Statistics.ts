import { GameStatistics } from "./types";

export class Statistics implements GameStatistics {
    private correntGuesses = 0;

    addCorrectGuess(): void {
        this.correntGuesses++;
    }
    
    addWrongGuess(): void {
    }
    
    calculateScore(timeSpentMilliseconds: number): number {
        const score = Math.round(this.correntGuesses * 100 - timeSpentMilliseconds / 100);

        return score < 0 ? 0 : score;
    }
}