import Element from 'src/components/Board/Element';
import CssStyleDeclaration from '../CssDataTypes/CssStyleDeclaration';
import { IElementState } from '../interfaces';

abstract class DisplayProperty {
    protected property: string;
    protected value: any;
    protected element: Element<IElementState>;
    protected parent: Element<IElementState> | undefined;
    public constructor(element: Element<IElementState>) {
        this.element = element;
        if (element.id.length > 1) {
            this.parent = this.getParent();
        }
    }
    public addRule(cssStyleDeclaration: CssStyleDeclaration) {
        cssStyleDeclaration.addRule(this.element, this.property, this.convertValue());
    }
    public getProperty(): string {
        return this.property;
    }
    public setValue(value: any) {
        this.value = value;
    }
    public getValue() {
        return this.value;
    }
    public getElement() {
        return this.element;
    }
    protected getSketchBoard() {
        return this.element.sketchBoard;
    }
    protected getParent(): Element<IElementState> {
        const sketchBoard = this.getSketchBoard();
        const result = sketchBoard.findElementById(sketchBoard, this.element.id.substr(0, this.element.id.length - 1));
        return result;
    }
    protected getNoParentErrorMessage() {
        return `
        This DisplayProperty has no parent. 
        (in this case element should be instance of WindowSketch)
        `;
    }
    protected abstract convertValue(): string;
}

export default DisplayProperty;