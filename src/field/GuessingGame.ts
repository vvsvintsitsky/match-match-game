import { Picture, Answer, Question, Author } from "./types";


const ANSWERS_PER_QUESTION = 4;

abstract class AnswerByPictures {
  constructor(private pictures: Picture[]) {}

  protected abstract convertPictureToAnswer(picture: Picture): Answer;

  create(): Answer[] {
    return this.pictures.map((picture) => this.convertPictureToAnswer(picture));
  }
}

class AnswersTextByAuthor extends AnswerByPictures {
  protected convertPictureToAnswer(picture: Picture): Answer {
    return { text: picture.author.name };
  }
}

class AnswersTextByPictureName extends AnswerByPictures {
  protected convertPictureToAnswer(picture: Picture): Answer {
    return { text: picture.name };
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export class GuessingGame {
  private questions: Question[] = [];

  private currentQuestionIndex = 0;

  constructor(
    private authors: Author[],
    private pictures: Picture[],
    private questionQuantity: number,
  ) {}

  private getPicture(questionIndex: number) {
    return this.pictures[questionIndex % this.pictures.length];
  }

  private getQuestionText() {
      return `Who is the author? #${getRandomInt(0, 100)}`;
  }

  public init() {
    this.questions = Array.from(
      { length: this.questionQuantity },
      (_, index) => {
        const picture = this.getPicture(index);
        const { author: pictureAuthor } = picture;

        const authorsWithoutPictureAuthor = this.authors.filter(
          (author) => author !== pictureAuthor
        );
        
        const authorsForAnswer = [];
        while (authorsForAnswer.length < ANSWERS_PER_QUESTION - 1) {
            const authorIndexToPick = getRandomInt(0, authorsWithoutPictureAuthor.length);
            authorsForAnswer.push(...authorsWithoutPictureAuthor.splice(authorIndexToPick, 1));
        }

        const correctAuthorIndex = getRandomInt(0, ANSWERS_PER_QUESTION - 1);
        authorsForAnswer.splice(correctAuthorIndex, 0, pictureAuthor);

        const answers = authorsForAnswer.map(author => ({
            text: author.name,
        }));

        return {
            text: this.getQuestionText(),
            answers,
            correctAnswer: answers[correctAuthorIndex],
        }
      }
    );
  }

  public getCurrentQuestionIndex(): number {
      return this.currentQuestionIndex;
  }

  public getCurrentQuestion() {
    return this.questions[this.getCurrentQuestionIndex()];
  }

  public checkAnswer(answer: Answer): boolean {
    return answer === this.getCurrentQuestion().correctAnswer;
  }

  private goToQuestion(questionIndex: number): void {
      this.currentQuestionIndex = questionIndex;
  }

  public goToNextQuestion(): void {
    this.goToQuestion(this.currentQuestionIndex + 1);
  }

  public goToPreviousQuestion(): void {
    this.goToQuestion(this.currentQuestionIndex - 1);
  }

  public isDone(): boolean {
      return this.currentQuestionIndex === this.questions.length;
  }
}
