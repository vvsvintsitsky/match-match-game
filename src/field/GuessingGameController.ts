import { GuessingGame } from "./GuessingGame";
import { QuestionView } from "./QuestionView";
import { Answer } from "./types";

export class GuessingGameController {
    private questionView!: QuestionView;

    constructor(private guessingGame: GuessingGame, createQuestionView: (onAnswerClick: (answer: Answer) => void) => QuestionView) {
        this.questionView = createQuestionView(this.onAnswerClick);
    }

    private onAnswerClick = (answer: Answer) => {
        const isAnswerCorrect = this.guessingGame.checkAnswer(answer);

        if (isAnswerCorrect) {
            this.guessingGame.goToNextQuestion();
            this.renderCurrentQuestion();
        }
    };

    private renderCurrentQuestion() {
        this.questionView.setQuestion(this.guessingGame.getCurrentQuestion());
        this.questionView.render();
    }

    public init() {
        this.guessingGame.init();
        this.renderCurrentQuestion();
    }
}