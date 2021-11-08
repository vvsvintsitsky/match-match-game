import { Answer, Question } from "./types";

export class QuestionView {
    private root = document.createElement('div');
    private question!: Question;
    constructor(private el: HTMLElement, private onAnswerClick: (answer: Answer) => void) {

    }

    public setQuestion(question: Question) {
        this.question = question;
    }

    public render() {
        this.root = document.createElement('div');
        const questionTextElement = document.createElement('div');
        questionTextElement.textContent = this.question.text;

        this.root.appendChild(questionTextElement);

        this.question.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.textContent = `${index + 1}: ${answer.text}`;
            answerElement.addEventListener('click', () => this.onAnswerClick(answer));
            this.root.appendChild(answerElement);
        })

        this.el.innerHTML = ''
        this.el.appendChild(this.root);
    }
}