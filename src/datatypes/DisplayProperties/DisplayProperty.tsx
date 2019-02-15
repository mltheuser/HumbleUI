import { SketchBoard } from 'src/components/Board/SketchBoard';
import CssStyleDeclaration from '../CssDataTypes/CssStyleDeclaration';

/*
    We can not import AbsolutePositionedComponent and BoardElement because that would cause a
    circular Referenz.
    That is the reason for element of type any.
    We assume that element is of type BoardElement if it has an id Property.
*/

abstract class DisplayProperty {
    protected property: string;
    protected value: any;
    protected element: any;
    protected parent: any;
    public constructor(element: any) {
        this.element = element;
        if (element.id) { // an existing id implies element is instance of BoardElement
            this.parent = this.getParentByBoardElement(element);
        }
    }
    public addRule(cssStyleDeclaration: CssStyleDeclaration) {
        if (this.element.id) {
            cssStyleDeclaration.addRule(this.element, this.property, this.convertValue());
        } else {
            throw EvalError("this.element must be instanceof BoardElement to call this method.");
        }
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
    protected getParentByBoardElement(boardElement: any) {
        const sketchBoard = SketchBoard.getInstance();
        const id = boardElement.getId();
        const result = sketchBoard.findElementById(sketchBoard, id.substr(0, id.length - 1));
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