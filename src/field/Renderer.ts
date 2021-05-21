import { CardRenderer, Card } from "../types";

export class Renderer implements CardRenderer<HTMLElement> {
    renderCard(card: Card): HTMLElement {
        return this.createCardElement(card.value);
    }
  
    renderShirt(): HTMLElement {
      return this.createCardElement("black");
    }
  
    private createCardElement(backgroundColor: string) {
      const cardElement = document.createElement("div");
      cardElement.style.backgroundColor = backgroundColor;
      cardElement.style.width = "100%";
      cardElement.style.height = "100%";
      return cardElement;
    }
  }