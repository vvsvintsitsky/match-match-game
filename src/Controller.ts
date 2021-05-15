import { CardPosition, FieldController, FieldModel, FieldView, GameStatistics } from "./types";

export class Controller implements FieldController {
    private fieldView: FieldView;

    private selectedCardPosition: CardPosition | undefined;

    constructor(
        private fieldModel: FieldModel,
        createFieldView: (controller: FieldController) => FieldView,
        private gameStatistics: GameStatistics,
        private onEnd: () => void,
    ) {
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
            return;
        }

        const isWrongGuess = !this.fieldModel.pairCards(this.selectedCardPosition, position);
        if (isWrongGuess) {
            this.processWrongGuess(this.selectedCardPosition);
            this.processWrongGuess(position);
            this.selectedCardPosition = undefined;
            this.gameStatistics.addWrongGuess();
            return;
        }

        this.fieldView.markCardSuccess(this.selectedCardPosition);
        this.fieldView.markCardSuccess(position);
        this.selectedCardPosition = undefined;
        this.gameStatistics.addCorrectGuess();

        if (this.fieldModel.isSolved()) {
            this.onEnd();
        }
    }

    private shouldIgnoreCardSelection(position: CardPosition) {
        const isPreviouslySelectedPosition = position.x === this.selectedCardPosition?.x && position.y === this.selectedCardPosition.y;
        return isPreviouslySelectedPosition || this.fieldModel.isCardPaired(position);
    }

    private processWrongGuess(position: CardPosition) {
        this.fieldView.markCardFail(position);
        this.fieldView.turnCardDown(position);
    }
}