export interface Card {
    id: string;
    value: string;
}

export interface CardPosition {
    x: number;
    y: number;
}

export interface FieldSize {
    rows: number;
    columns: number;
}

export interface FieldModel {
    getCardAtPosition(position: CardPosition): Card;
    getSize(): FieldSize;
    isCardPaired(position: CardPosition): boolean;
    pairCards(first: CardPosition, second: CardPosition): boolean;
    isSolved(): boolean;
}

export interface CardRenderer<T> {
    renderCard(card: Card): T;
    renderShirt(): T;
}

export interface Renderable {
    render(): HTMLElement;
    dispose(): void;
}

export interface FieldView extends Renderable {
    turnCardUp(position: CardPosition): void;
    turnCardDown(position: CardPosition): void;
    markCardSuccess(position: CardPosition): void;
    markCardFail(position: CardPosition): void;
}

export interface FieldController {
    selectCard(position: CardPosition): void;
}

export interface GameStatistics {
    addCorrectGuess(): void;
    addWrongGuess(): void;
    calculateScore(timeSpentMilliseconds: number): number;
}

export interface Tab {
    id: string;
    name: string;
    getContent: () => Renderable;
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
}

export interface GameResult {
    user: User;
    score: number;
}

export interface GameStorage {
    getResults: () => Promise<GameResult[]>;
    saveResult: (result: GameResult) => Promise<void>;
}
