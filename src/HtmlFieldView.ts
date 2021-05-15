import { FieldView, CardPosition, FieldModel, CardRenderer, FieldController } from "./types";

export class HtmlFieldView implements FieldView {
    private fieldElement!: HTMLElement;

    constructor(
        private rootElement: HTMLElement,
        private fieldModel: FieldModel,
        private cardRenderer: CardRenderer<HTMLElement>,
        private fieldController: FieldController
    ) {
    }

    public init(): void {
        this.clearRootElement();
        this.fieldElement = document.createElement("div");
        const { rows, columns } = this.fieldModel.getSize();

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const cardElement = document.createElement("div");
                const { style } = cardElement;
                style.margin = "10px 10px";
                style.width = "30px";
                style.height = "40px";
                cardElement.setAttribute(this.getRowAttribute(), String(row));
                cardElement.setAttribute(this.getColumnAttribute(), String(column));

                cardElement.appendChild(this.cardRenderer.renderShirt());

                this.fieldElement.appendChild(cardElement);
            }
        }

        const { style } = this.fieldElement;
        style.display = "flex";
        style.flexWrap = "wrap";

        this.fieldElement.addEventListener("click", this.onFieldClick);

        this.rootElement.appendChild(this.fieldElement);
    }

    public destroy(): void {
        this.clearRootElement();
    }

    public turnCardUp(position: CardPosition): void {
        this.changeCardContent(position, this.cardRenderer.renderCard(this.fieldModel.getCardAtPosition(position)));
    }

    public turnCardDown(position: CardPosition): void {
        setTimeout(() => this.changeCardContent(position, this.cardRenderer.renderShirt()), this.getTurnDownDelay());
    }

    public markCardSuccess(position: CardPosition): void {
        this.markCard(position, "-7px 7px 7px green");
    }

    public markCardFail(position: CardPosition): void {
        this.markCard(position, "5px 5px 5px red");
    }

    public unmarkCard(position: CardPosition): void {
        const cardElement = this.findCardElementForPosition(position);

        cardElement.style.boxShadow = "";
    }

    private clearRootElement() {
        this.rootElement.innerHTML = "";
    }

    private getRowAttribute() {
        return "data-row";
    }

    private getColumnAttribute() {
        return "data-column";
    }

    private findCardElementForPosition({ x, y }: CardPosition) {
        const element = this.fieldElement.querySelector(`[${this.getRowAttribute()}="${x}"][${this.getColumnAttribute()}="${y}"]`);

        if (!this.isValidElement(element)) {
            throw new Error(`No element was found for position=[${x},${y}]`)
        }

        return element;
    }

    private changeCardContent(position: CardPosition, content: HTMLElement) {
        const element = this.findCardElementForPosition(position);
        element.innerHTML = "";
        element.appendChild(content);
    }

    private isValidElement(element: EventTarget | null): element is HTMLElement {
        return element instanceof HTMLElement;
    }

    private markCard(position: CardPosition, boxShadow: string): void {
        const cardElement = this.findCardElementForPosition(position);

        cardElement.style.boxShadow = boxShadow;

        setTimeout(() => this.unmarkCard(position), this.getMarkDuration());
    }

    private getMarkDuration() {
        return 100;
    }

    private getTurnDownDelay() {
        return this.getMarkDuration();
    }

    private onFieldClick = ({ target }: MouseEvent) => {
        if (!this.isValidElement(target)) {
            return;
        }

        const position = this.defineCardPosition(target);

        if (!position) {
            return;
        }

        this.fieldController.selectCard(position);
    }

    private defineCardPosition(element: HTMLElement): CardPosition | undefined {
        const row = element.getAttribute(this.getRowAttribute());
        const column = element.getAttribute(this.getColumnAttribute());

        if (row && column) {
            return { x: Number(row), y: Number(column) };
        }

        if (element.parentElement) {
            return this.defineCardPosition(element.parentElement);
        }

        return undefined;
    }
}