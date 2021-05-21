import { Renderable } from "../types";
import { Tab } from "../types";

export class Tabs implements Renderable {
    private tabsElement: HTMLElement
    private headerElement: HTMLElement;
    private contentElement: HTMLElement;
    private selectedTab: Tab;
    private selectedTabRenderable?: Renderable;

    constructor(private tabs: Tab[]) {
        this.tabsElement = document.createElement("div");
        this.headerElement = document.createElement("div");
        this.headerElement.style.height = "100px";
        this.contentElement = document.createElement("div");
        this.tabsElement.append(this.headerElement, this.contentElement);

        this.selectedTab = tabs[0];
    }

    public render() {
        const tabHeadings = this.tabs.map(tab => {
            const tabButton = document.createElement("button");
            tabButton.innerText = tab.name;
            tabButton.setAttribute(this.getTabIdAttributeName(), tab.id);
            tabButton.style.color = this.getTabTextColor();
            return tabButton;
        });
        
        this.headerElement.append(...tabHeadings);
        this.headerElement.addEventListener("click", this.onHeaderClick);

        this.setActiveTab(this.selectedTab);

        return this.tabsElement;
    }

    public dispose() {
        this.tabsElement.innerHTML = "";
        this.selectedTabRenderable?.dispose();
    }

    private getTabIdAttributeName() {
        return "data-tabId";
    }

    private isHtmlElement(element?: EventTarget | null): element is HTMLElement {
        return element instanceof HTMLElement;
    }

    private onHeaderClick = (event: MouseEvent) => {
        const { target } = event;
        if (!this.isHtmlElement(target)) {
            throw new Error("Target is not a valid html element");
        }

        const tabId = target.getAttribute(this.getTabIdAttributeName());
        const tabToSelect = this.tabs.find(tab => tab.id === tabId);

        if (tabToSelect) {
            this.changeActiveTab(tabToSelect);
        }
    }

    private changeActiveTab(tab: Tab) {
        this.selectedTabRenderable?.dispose();
        this.contentElement.innerHTML = "";

        const prevSelectedTabHeader = this.findTabHeaderElement(this.selectedTab.id);
        prevSelectedTabHeader.style.color = this.getTabTextColor();

        this.selectedTabRenderable?.dispose();

        this.setActiveTab(tab);
    }

    private setActiveTab(tab: Tab) {
        const currentSelectedTabHeader = this.findTabHeaderElement(tab.id);
        currentSelectedTabHeader.style.color = this.getActiveTabTextColor();

        this.selectedTabRenderable = tab.getContent();
        this.contentElement.append(this.selectedTabRenderable.render());
        this.selectedTab = tab;
    }

    private getTabTextColor() {
        return "blue";
    }

    private getActiveTabTextColor() {
        return "red";
    }

    private findTabHeaderElement(id: string) {
        const selectedTabElement = this.headerElement.querySelector(`[${this.getTabIdAttributeName()}="${id}"]`);
        if (!selectedTabElement) {
            throw new Error(`No header element was found for tabId=${id}`);
        }
        if (!this.isHtmlElement(selectedTabElement)) {
            throw new Error(`No header element was found for tabId=${id}`);
        }

        return selectedTabElement;
    }
}