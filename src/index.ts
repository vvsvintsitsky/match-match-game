import { HtmlFieldView } from "./field/HtmlFieldView";
import { Model } from "./field/Model";
import { Controller } from "./field/Controller";
import { Renderer } from "./field/Renderer";
import { Statistics } from "./Statistics";

const model = new Model({ rows: 3, columns: 2 }, [{ id: "1", value: "blue"}, { id: "2", value: "green"}]);
const statistics = new Statistics();

const getCurrentTimeInMilliseconds = () => new Date().getTime();
const startTime = getCurrentTimeInMilliseconds();

const controller = new Controller(
  model,
  (controller) => new HtmlFieldView(document.body, model, new Renderer(), controller),
  statistics,
  () => alert(`score: ${statistics.calculateScore(getCurrentTimeInMilliseconds() - startTime)}`),
);

controller.init();