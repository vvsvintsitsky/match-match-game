import { HtmlFieldView } from "./HtmlFieldView";
import { Model } from "./Model";
import { Controller } from "./Controller";
import { Renderer } from "./Renderer";

const model = new Model({ rows: 3, columns: 2 }, [{ id: "1", value: "blue"}, { id: "2", value: "green"}]);

const controller = new Controller(
  model,
  (controller) => new HtmlFieldView(document.body, model, new Renderer(), controller),
  () => alert("done"),
);

controller.init();