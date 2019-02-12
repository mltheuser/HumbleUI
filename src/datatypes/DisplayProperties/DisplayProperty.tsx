import { AbsolutePositionedComponent, IAbsolutePositionedComponentState } from 'src/components/AbsolutePositionedComponent';
import { BoardElement, IBoardElementState } from 'src/components/Board/BoardElement';
import { SketchBoard } from 'src/components/Board/SketchBoard';
import CssStyleDeclaration from '../CssDataTypes/CssStyleDeclaration';

abstract class DisplayProperty {
    protected property: string;
    protected value: any;
    protected element: AbsolutePositionedComponent<IAbsolutePositionedComponentState>;
    protected parent: AbsolutePositionedComponent<IAbsolutePositionedComponentState> | undefined;
    public constructor(element: AbsolutePositionedComponent<IAbsolutePositionedComponentState>) {
        this.element = element;
        if (element instanceof BoardElement) {
            this.parent = this.getParentByBoardElement(element);
        }
    }
    public addRule(cssStyleDeclaration: CssStyleDeclaration) {
        if (this.element instanceof BoardElement) {
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
    protected getParentByBoardElement(boardElement: BoardElement<IBoardElementState>): AbsolutePositionedComponent<IAbsolutePositionedComponentState> {
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