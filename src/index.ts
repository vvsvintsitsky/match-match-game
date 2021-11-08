
import { Game } from "./Game";
import { IdbStorage } from "./storage/IdbStorage";
import { Tabs } from "./tabs/Tabs";
import { Tab } from "./types";

import { GuessingGame } from "./field/GuessingGame";
import { QuestionView } from "./field/QuestionView";
import { Answer } from "./field/types";
import { GuessingGameController } from "./field/GuessingGameController";

const storage = new IdbStorage("yourGithubId");
const user = {
  firstName: "firstName",
  lastName: "lastName",
  email: "user@example.com",
};

const gameDifficulties = [2,3,4,5,6,7]
const cardCategories = ['animals', 'cars']

// @ts-ignore
window.createGame = () => {
  const authors = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }];
  const questionsQuantity = 10;
  const pictures = Array.from({ length: questionsQuantity }, (_, index) => {
    return {
      author: authors[index % authors.length],
    }
  });

  // @ts-ignore
  const game = new GuessingGame(authors, pictures, questionsQuantity, null);

  const createGameView = (onAnswerClick: (answer: Answer) => void) => new QuestionView(document.body, onAnswerClick);

  return new GuessingGameController(game, createGameView);
}

const TABS: Tab[] = [
  {
    id: "game",
    name: "Game",
    getContent: () => new Game({ rows: 3, columns: 2 }, [{ id: "1", value: "blue" }, { id: "2", value: "green" }], user, storage),
  },
  {
    id: "stubOne",
    name: "Stub tab XXX",
    getContent: () => ({
      dispose: () => undefined,
      render: () => {
        const div = document.createElement("div");
        div.textContent = "FIRST";
        const { style } = div;
        style.height = "100px";
        style.width = "300px";
        style.backgroundColor = "violet";
        return div;
      }
    })
  },
  {
    id: "stubTwo",
    name: "Stub tab #2",
    getContent: () => ({
      dispose: () => undefined,
      render: () => {
        const div = document.createElement("div");
        div.textContent = "SECOND";
        const { style } = div;
        style.height = "100px";
        style.width = "300px";
        style.backgroundColor = "pink";
        return div;
      }
    })
  }
];



const tabs = new Tabs(TABS);
const tabsElement = tabs.render();
document.body.append(tabsElement);
