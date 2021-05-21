
import { Game } from "./Game";
import { Tabs } from "./tabs/Tabs";
import { Tab } from "./types";

const TABS: Tab[] = [
  {
    id: "game",
    name: "Game",
    getContent: () => new Game({ rows: 3, columns: 2 }, [{ id: "1", value: "blue" }, { id: "2", value: "green" }]),
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
