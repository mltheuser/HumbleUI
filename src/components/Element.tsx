import * as React from 'react';
import App from 'src/App';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import { ICoordiante, IElementState } from 'src/datatypes/interfaces';
import SketchBoard from './SketchBoard';

class Element<S extends IElementState> extends React.Component<any, S> {

    public name: string = '';

    public initHeight: number = 0;

    public initLeft: number = 0;

    public initTop: number = 0;

    public initWidth: number = 0;

    public state: S = this.getInitialState();

    constructor(public id: string, public app: App, public sketchBoard: SketchBoard, public offset: ICoordiante) {
        super({ key: id });
        this.setInitalName();
        this.setState.bind(this);
    }

    public getActuallHeight(): number {
        return this.state.height / this.sketchBoard.state.zoom;
    }

    public getActuallleft(): number {
        return this.state.left / this.sketchBoard.state.zoom;
    }

    public getActuallTop(): number {
        return this.state.top / this.sketchBoard.state.zoom;
    }

    public getActuallWidth(): number {
        return this.state.width / this.sketchBoard.state.zoom;
    }

    public updateInits(mode = 2) {
        if (mode > 0) {
            this.initHeight = this.state.height
            this.initWidth = this.state.width;
        }
        if (mode !== 1) {
            this.initTop = this.state.top;
            this.initLeft = this.state.left;
        }
    }

    public move(left: number, top: number) {
        this.state.left = left;
        this.state.top = top;
    }

    public canItersectByHeightWith(element: any) {
        if (element instanceof Element === false) {
            throw new Error('Expected element to be instance of Element.');
        }
        return ((this.state.top >= element.state.top && this.state.top <= element.state.top + element.state.height) || (this.state.top + this.state.height >= element.state.top && this.state.top + this.state.height <= element.state.top + element.state.height)) || ((element.state.top >= this.state.top && element.state.top <= this.state.top + this.state.height) || (element.state.top + element.state.height >= this.state.top && element.state.top + element.state.height <= this.state.top + this.state.height));
    }

    public canItersectByWidthWith(element: any) {
        if (element instanceof Element === false) {
            throw new Error('Expected element to be instance of Element.');
        }
        return ((this.state.left >= element.state.left && this.state.left <= element.state.left + element.state.width) || (this.state.left + this.state.width >= element.state.left && this.state.left + this.state.width <= element.state.left + element.state.width)) || ((element.state.left >= this.state.left && element.state.left <= this.state.left + this.state.width) || (element.state.left + element.state.width >= this.state.left && element.state.left + element.state.width <= this.state.left + this.state.width));
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

    public render() {
        return (
            <div />
        );
    }

    public extractStyleDeclaration(): CssStyleDeclaration {
        return new CssStyleDeclaration();
    }

    public toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration, level: number): string {
        return '';
    }

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
        return {
            height: 0,
            left: this.sketchBoard.state.tool.mouseState.startX,
            refined: false,
            selected: false,
            top: this.sketchBoard.state.tool.mouseState.startY,
            width: 0,
        } as S;
    }

    protected setInitalName() {
        this.name = `Element${this.id}`;
    }

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