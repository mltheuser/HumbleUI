import * as React from 'react';
import App from 'src/App';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import DisplayPropertyCollection from 'src/datatypes/DisplayProperties/DisplayPropertyCollection';
import Height from 'src/datatypes/DisplayProperties/Properties/Height';
import Left from 'src/datatypes/DisplayProperties/Properties/Left';
import Top from 'src/datatypes/DisplayProperties/Properties/Top';
import Width from 'src/datatypes/DisplayProperties/Properties/Width';
import { ICoordiante, IElementState } from 'src/datatypes/interfaces';
import SketchBoard from './SketchBoard';

abstract class Element<S extends IElementState> extends React.Component<any, S> {

    public name: string;

    public initHeight: number;

    public initLeft: number;

    public initTop: number;

    public initWidth: number;

    public state: S = this.getInitialState();

    constructor(public id: string, public app: App, public sketchBoard: SketchBoard, public offset: ICoordiante) {
        super({});
    }

    public getLeftBorder(): number{
        return this.state.displayProperties.left.getValue();
    }

    public getRightBorder(): number{
        return this.state.displayProperties.left.getValue() + this.state.displayProperties.width.getValue();
    }

    public getTopBorder(): number{
        return this.state.displayProperties.top.getValue();
    }

    public getBottomBorder(): number{
        return this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue();
    }

    public getCenter(): ICoordiante{
        return {
            x: this.getLeftBorder() + (this.getRightBorder() - this.getLeftBorder()) / 2,
            y: this.getTopBorder() + (this.getBottomBorder() - this.getTopBorder()) / 2,
        };
    }

    public getActuallHeight(): number {
        return this.state.displayProperties.height.getValue() / this.sketchBoard.state.zoom;
    }

    public getActuallleft(): number {
        return this.state.displayProperties.left.getValue() / this.sketchBoard.state.zoom;
    }

    public getActuallTop(): number {
        return this.state.displayProperties.top.getValue() / this.sketchBoard.state.zoom;
    }

    public getActuallWidth(): number {
        return this.state.displayProperties.width.getValue() / this.sketchBoard.state.zoom;
    }

    public updateInits(mode = 2) {
        if (mode > 0) {
            this.initHeight = this.state.displayProperties.height.getValue();
            this.initWidth = this.state.displayProperties.width.getValue();
        }
        if (mode !== 1) {
            this.initTop = this.state.displayProperties.top.getValue();
            this.initLeft = this.state.displayProperties.left.getValue();
        }
    }

    public move(left: number, top: number) {
        this.state.displayProperties.left.setValue(left);
        this.state.displayProperties.top.setValue(top);
    }

    public canItersectByHeightWith(element: Element<IElementState>) {
        if (element instanceof Element === false) {
            throw new Error('Expected element to be instance of Element.');
        }
        return ((this.state.displayProperties.top.getValue() >= element.state.displayProperties.top.getValue() && this.state.displayProperties.top.getValue() <= element.state.displayProperties.top.getValue() + element.state.displayProperties.height.getValue()) || (this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue() >= element.state.displayProperties.top.getValue() && this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue() <= element.state.displayProperties.top.getValue() + element.state.displayProperties.height.getValue())) || ((element.state.displayProperties.top.getValue() >= this.state.displayProperties.top.getValue() && element.state.displayProperties.top.getValue() <= this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue()) || (element.state.displayProperties.top.getValue() + element.state.displayProperties.height.getValue() >= this.state.displayProperties.top.getValue() && element.state.displayProperties.top.getValue() + element.state.displayProperties.height.getValue() <= this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue()));
    }

    public canItersectByWidthWith(element: Element<IElementState>) {
        const localLeft = this.state.displayProperties.left.getValue();
        const localWidth = this.state.displayProperties.width.getValue();
        const elementLeft = element.state.displayProperties.left.getValue();
        const elementWidth = element.state.displayProperties.width.getValue();
        return ((localLeft >= elementLeft && localLeft <= elementLeft + elementWidth) || (localLeft + localWidth >= elementLeft && localLeft + localWidth <= elementLeft + elementWidth)) || ((elementLeft >= localLeft && elementLeft <= localLeft + localWidth) || (elementLeft + elementWidth >= localLeft && elementLeft + elementWidth <= localLeft + localWidth));
    }

    public isFamilyMemberOf(element: any) {
        if (element instanceof Element === false) {
            throw new Error('Expected element to be instance of Element.');
        }
        for (let i = 0, len = element.id.length, len2 = this.id.length; i < len; ++i) {
            if (i >= len2 || this.id[i] !== element.id[i]) {
                return false;
            }
        }
        return true
    }

    public abstract render(): React.ReactNode;

    public getStyleDecleration(): CssStyleDeclaration {
        const localDeclaration = new CssStyleDeclaration();
        this.state.displayProperties.addToStyleDecleration(localDeclaration);
        return localDeclaration;
    }

    public abstract toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration, level: number): string;

    protected getTabLevel(level: number): string {
        let result = '';
        for (let i = 0; i < level; ++i) {
            result += '\t';
        }
        return result;
    }

    // refactor this mess
    protected renderSelectors(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        let result = '';
        result += this.renderId(localStyleDecleration, globalStyleDecleration);
        if (result !== '') {
            result += ' ';
        }
        result += this.renderClasses(localStyleDecleration, globalStyleDecleration);
        return result;
    }

    protected getInitialState(): S {
        const displayProperties = new DisplayPropertyCollection();
        // top
        const top = new Top(this);
        top.setValue(this.sketchBoard.state.tool.mouseState.startY);
        displayProperties.add(top);
        // left
        const left = new Left(this);
        left.setValue(this.sketchBoard.state.tool.mouseState.startX);
        displayProperties.add(left);
        // height
        const height = new Height(this);
        height.setValue(0);
        displayProperties.add(height);
        // width
        const width = new Width(this);
        width.setValue(0);
        displayProperties.add(width);
        return {
            displayProperties,
            inEditMode: false,
            refined: false,
            selected: false,
        } as S;
    }

    protected setInitalName(): string {
        return this.constructor.name + this.id;
    };

    private renderId(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        let result = '';
        const localId = localStyleDecleration.getSubjectsId(this);
        const globalId = globalStyleDecleration.getSubjectsId(this);
        // Frage kann eine Id in der Global und Local stehen?
        if (globalId === null) {
            if (localId !== null) {
                result += 'id = "' + localId.getSelectorName() + '"';
            }
        } else if (localId === null) {
            result += 'id = "' + globalId.getSelectorName() + '"';
        } else {
            throw EvalError(`
            There is a subject with an id in the local and global styleDecleration. 
            The is unexpected Behaviour. 
            Please think about how to prevent this or which one to pick.`
            );
        }
        return result;
    }

    private renderClasses(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        let result = '';
        const classes = globalStyleDecleration.getSubjectsClasses(this).concat(localStyleDecleration.getSubjectsClasses(this));
        if (classes.length !== 0) {
            result += 'class = "';
            for (let i = 0, len = classes.length; i < len; ++i) {
                const localClass = classes[i];
                result += localClass.getSelectorName();
                if (i + 1 < len) {
                    result += ' ';
                }
            }
            result += '"';
        }
        return result;
    }

}

export default Element;