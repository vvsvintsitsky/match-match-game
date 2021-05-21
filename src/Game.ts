import { HtmlFieldView } from "./field/HtmlFieldView";
import { Model } from "./field/Model";
import { Controller } from "./field/Controller";
import { Renderer } from "./field/Renderer";
import { Statistics } from "./Statistics";
import { Card, FieldController, FieldSize, FieldView, GameStorage, Renderable, User } from "./types";

export class Game implements Renderable {
  private controller: FieldController;
  private view: FieldView;
  private statistics: Statistics;
  private startTime: number;

  constructor(fieldSize: FieldSize, cards: Card[], private user: User, private storage: GameStorage) {
    const model = new Model(fieldSize, cards);
    this.statistics = new Statistics();
    this.controller = new Controller(model, () => this.getView(), this.statistics, () => this.onEnd());
    this.view = new HtmlFieldView(model, new Renderer(), () => this.getController());
    this.startTime = this.getCurrentTimeInMilliseconds();
  }

  render() {
      return this.getView().render();
  }

  dispose() {
      this.getView().dispose();
  }

  private getController() {
    return this.controller;
  }

  private getView() {
    return this.view;
  }

  private async onEnd () {
    const result = {
      score: this.statistics.calculateScore(this.getCurrentTimeInMilliseconds() - this.startTime),
      user: this.user,
    };

    await this.storage.saveResult(result);
    
    alert(`score: ${result.score}`)
  }

  private getCurrentTimeInMilliseconds() {
      return new Date().getTime();
  }
}