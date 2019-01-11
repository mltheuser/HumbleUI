import * as React from 'react';
import App from 'src/App';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import BackgroundColor from 'src/datatypes/DisplayProperties/Properties/BackgroundColor';
import BorderColor from 'src/datatypes/DisplayProperties/Properties/Border/BorderColor';
import BorderStyle from 'src/datatypes/DisplayProperties/Properties/Border/BorderStyle';
import BorderWidth from 'src/datatypes/DisplayProperties/Properties/Border/BorderWidth';
import { ICoordiante, IElementContainerState, IElementContainerStyle } from 'src/datatypes/interfaces';
import HumbleArray from '../../../datatypes/HumbleArray';
import Element from '../Element';
import SketchBoard from '../SketchBoard';

abstract class ElementContainer extends Element<IElementContainerState> {

    constructor(id: string, app: App, sketchBoard: SketchBoard, offset: ICoordiante, sketches = new HumbleArray()) {
        super(id, app, sketchBoard, offset);
        this.state = this.getInitialElementContainerState(sketches);
    }

    public getRightBorder(): number {
        if (this.state.borderChecked === true) {
            return this.state.displayProperties.left.getValue() + this.state.displayProperties.width.getValue() + 2 * this.state.displayProperties["border-width"].getValue();
        }
        return this.state.displayProperties.left.getValue() + this.state.displayProperties.width.getValue();
    }

    public getBottomBorder(): number {
        if (this.state.borderChecked === true) {
            return this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue() + 2 * this.state.displayProperties["border-width"].getValue();
        }
        return this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue();
    }

    public updateInits(mode: number = 2): void {
        super.updateInits(mode);
        if (mode > 2) {
            for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                this.state.sketches.data[i].updateInits(3);
            }
        }
    }

    public updateElementContainerOffset() {
        const parentId = this.id.substr(0, this.id.length - 1);
        this.offset.x = this.sketchBoard.calculateSketchOffset(parentId, 0, this.sketchBoard);
        this.offset.y = this.sketchBoard.calculateSketchOffset(parentId, 1, this.sketchBoard);
    }

    public move(left: number, top: number) {
        super.move(left, top);
        this.updateChildOffsets();
    }

    public updateChildOffsets() {
        this.updateElementContainerOffset();
        for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
            const child = this.state.sketches.data[i];
            if (child instanceof ElementContainer) {
                child.updateChildOffsets();
            }
        }
    }

    public getOffset(mode: number) {
        if (mode === 0) {
            return this.state.displayProperties.left.getValue() + this.state.displayProperties["border-width"].getValue();
        }
        return this.state.displayProperties.top.getValue() + this.state.displayProperties["border-width"].getValue();
    }

    public resizeChildren(parentIsOnSketchboard = false) {
        for (let i = 0, len = this.state.sketches.data.length, child = null; i < len; ++i) {
            child = this.state.sketches.data[i];
            child.state.displayProperties.left.setValue((child.initLeft / this.initWidth) * this.state.displayProperties.width.getValue());
            child.state.displayProperties.width.setValue((child.initWidth / this.initWidth) * this.state.displayProperties.width.getValue())
            if (parentIsOnSketchboard === false) {
                child.state.displayProperties.top.setValue((child.initTop / this.initHeight) * this.state.displayProperties.height.getValue());
                child.state.displayProperties.height.setValue((child.initHeight / this.initHeight) * this.state.displayProperties.height.getValue());
            }
            if (child instanceof ElementContainer) {
                child.resizeChildren();
            }
        }
    }

    public render() {
        return (
            <div key={this.id} className={this.constructor.name} style={this.getInlineStyle()} id={this.id}>
                {this.state.sketches.render()}
            </div>
        );
    }

    public getStyleDecleration(): CssStyleDeclaration {
        const localDeclaration = super.getStyleDecleration();
        // now merge with the ones of the children
        for (const child of this.state.sketches.data) {
            localDeclaration.unite(child.getStyleDecleration());
        }
        return localDeclaration;
    }

    public abstract toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration, level: number): string;

    protected getInitialElementContainerState(sketches: HumbleArray): IElementContainerState {
        const state = super.getInitialState();
        state.sketches = sketches;
        // background-color
        const backgroundColor = new BackgroundColor(this);
        backgroundColor.setValue('#fff');
        state.displayProperties.add(backgroundColor);
        // border
        state.borderChecked = true;
        // border-color
        const borderColor = new BorderColor(this);
        borderColor.setValue('#d0d0d0');
        state.displayProperties.add(borderColor);
        // border-width
        const borderWidth = new BorderWidth(this);
        borderWidth.setValue(1);
        state.displayProperties.add(borderWidth);
        // border-style
        const borderStyle = new BorderStyle(this);
        borderStyle.setValue('solid');
        state.displayProperties.add(borderStyle);
        return state as IElementContainerState;
    }

    protected getInlineStyle(): IElementContainerStyle {
        const inline = {
            background: '',
            borderColor: this.state.displayProperties["border-color"].getValue(),
            borderStyle: this.state.displayProperties["border-style"].getValue(),
            borderWidth: this.state.displayProperties["border-width"].getValue(),
            height: this.state.displayProperties.height.getValue(),
            left: this.state.displayProperties.left.getValue(),
            top: this.state.displayProperties.top.getValue(),
            width: this.state.displayProperties.width.getValue(),
        }
        if (this.state.refined === true) {
            inline.background = this.state.displayProperties["background-color"].getValue();
        }
        if (this.state.borderChecked === false) {
            inline.top += inline.borderWidth;
            inline.left += inline.borderWidth;
            inline.borderWidth = 0;
        }
        return inline;
    }
}

export default ElementContainer;