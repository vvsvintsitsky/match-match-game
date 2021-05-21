import { HtmlFieldView } from "./field/HtmlFieldView";
import { Model } from "./field/Model";
import { Controller } from "./field/Controller";
import { Renderer } from "./field/Renderer";
import { Statistics } from "./Statistics";
import { Card, FieldController, FieldSize, FieldView, Renderable } from "./types";

export class Game implements Renderable {
  private controller: FieldController;
  private view: FieldView;
  private statistics: Statistics;
  private startTime!: number;

  constructor(fieldSize: FieldSize, cards: Card[]) {
    const model = new Model(fieldSize, cards);
    this.statistics = new Statistics();
    this.controller = new Controller(model, () => this.getView(), this.statistics, () => this.onEnd());
    this.view = new HtmlFieldView(model, new Renderer(), () => this.getController());
  }

  public resetStartTime() {
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

  private onEnd () {
    alert(`score: ${this.statistics.calculateScore(this.getCurrentTimeInMilliseconds() - this.startTime)}`)
  }

  private getCurrentTimeInMilliseconds() {
      return new Date().getTime();
  }
}