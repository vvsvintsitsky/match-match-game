import { Card, CardPosition, FieldModel, FieldSize } from "./types";

export class Model implements FieldModel {
    private hitMap!: Record<string, Record<string, boolean> | undefined>;
    private field!: Card[][];

    constructor(private fieldFize: FieldSize, private cards: Card[]) {
        this.generateField();
    }

    public getCardAtPosition(position: CardPosition): Card {
        return this.field[position.x][position.y];
    }
    
    public getSize(): { rows: number; columns: number; } {
        return this.fieldFize;
    }
    
    public isCardPaired({ x, y }: CardPosition): boolean {
        return !this.hitMap[x]?.[y];
    }

    public pairCards(first: CardPosition, second: CardPosition) {
        if (this.getCardAtPosition(first) !== this.getCardAtPosition(second)) {
            return false;
        }

        this.markAsPaired(first);
        this.markAsPaired(second);

        return true;
    }

    public isSolved() {
        return Object.keys(this.hitMap).length === 0;
    }

    private generateField() {
        const numberOfCells = (this.fieldFize.columns * this.fieldFize.rows);
        if (numberOfCells % 2) {
            throw new Error("Number of cells should be multiple of 2");
        }

        const numberOfPairs = numberOfCells / 2;

        const pairs = Array.from({ length: numberOfPairs }, (_, index) => this.cards[index % this.cards.length]);
        const fieldCards = pairs.concat(pairs);

        this.hitMap = {};
        this.field = [];
        for (let row = 0; row < this.fieldFize.rows; row++) {
            const rowHitMap: Record<string, boolean> = {};
            const cardRow: Card[] = [];
            for (let column = 0; column < this.fieldFize.columns; column++) {
                rowHitMap[column] = true;
                cardRow.push(fieldCards[row * this.fieldFize.columns + column]);
            }
            this.hitMap[row] = rowHitMap;
            this.field.push(cardRow);
        }
    }

    private markAsPaired(position: CardPosition) {
        if (this.isCardPaired(position)) {
            throw new Error(`Card at ${position.x}:${position.y} has been already paired`);
        }

        const rowHitMap = this.hitMap[position.x];
        if (!rowHitMap) {
            return;
        }

        delete rowHitMap[position.y];
        if (!Object.keys(rowHitMap).length) {
            delete this.hitMap[position.x];
        }
    }
}