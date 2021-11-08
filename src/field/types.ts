export interface Identifiable {
  id: string;
}

export interface Author extends Identifiable {
  name: string;
}

export interface Category extends Identifiable {
  name: string;
}

export interface Picture {
  id: string;
  name: string;
  src: string;
  author: Author;
  category: Category;
}

export interface Answer {
  text: string;
}

export interface Question {
  answers: Answer[];
  correctAnswer: Answer;
  text: string;
}
