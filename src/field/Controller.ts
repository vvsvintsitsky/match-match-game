import { CardPosition, FieldController, FieldModel, FieldView, GameStatistics } from "../types";

export class Controller implements FieldController {
    private selectedCardPosition: CardPosition | undefined;

    constructor(
        private fieldModel: FieldModel,
        private getView: () => FieldView,
        private gameStatistics: GameStatistics,
        private onEnd: () => void,
    ) {
    }

    public selectCard(position: CardPosition): void {
        if (this.shouldIgnoreCardSelection(position)) {
            return;
        }

        this.getView().turnCardUp(position);

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

        const view = this.getView();
        view.markCardSuccess(this.selectedCardPosition);
        view.markCardSuccess(position);
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
        const view = this.getView();
        view.markCardFail(position);
        view.turnCardDown(position);
    }
}