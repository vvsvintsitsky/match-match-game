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

export interface FieldView {
    init(): void;
    destroy(): void;
    turnCardUp(position: CardPosition): void;
    turnCardDown(position: CardPosition): void;
    markCard(position: CardPosition): void;
    unmarkCard(position: CardPosition): void;
}

export interface FieldController {
    init(): void;
    destroy(): void;
    selectCard(position: CardPosition): void;
}
