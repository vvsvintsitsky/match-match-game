import { CardPosition, FieldController, FieldModel, FieldView } from "./types";

export class Controller implements FieldController {
    private fieldView: FieldView;

    private selectedCardPosition: CardPosition | undefined;

    constructor(private fieldModel: FieldModel, createFieldView: (controller: FieldController) => FieldView, private onEnd: () => void) {
        this.fieldView = createFieldView(this);
    }

    public init(): void {
        this.fieldView.init();
    }

    public destroy(): void {
        this.fieldView.destroy();
    }

    public selectCard(position: CardPosition): void {
        if (this.shouldIgnoreCardSelection(position)) {
            return;
        }

        this.fieldView.turnCardUp(position);

        if (!this.selectedCardPosition) {
            this.selectedCardPosition = position;
            this.fieldView.markCard(this.selectedCardPosition);
            return;
        }

        if (!this.fieldModel.pairCards(this.selectedCardPosition, position)) {
            this.fieldView.unmarkCard(this.selectedCardPosition);
            this.fieldView.turnCardDown(this.selectedCardPosition);
            this.fieldView.turnCardDown(position);
            this.selectedCardPosition = undefined;
            return;
        }

        this.fieldView.unmarkCard(this.selectedCardPosition);
        this.fieldView.unmarkCard(position);
        this.selectedCardPosition = undefined;

        if (this.fieldModel.isSolved()) {
            this.onEnd();
        }
    }

    private shouldIgnoreCardSelection(position: CardPosition) {
        const isPreviouslySelectedPosition = position.x === this.selectedCardPosition?.x && position.y === this.selectedCardPosition.y;
        return isPreviouslySelectedPosition || this.fieldModel.isCardPaired(position);
    }
}