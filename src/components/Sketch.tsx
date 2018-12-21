import * as React from 'react';
import App from 'src/App';
import { ICoordiante, ISketchState } from 'src/datatypes/interfaces';
import HumbleArray from '../datatypes/HumbleArray';
import Element from './Element'
import SketchBoard from './SketchBoard';

class Sketch extends Element<ISketchState> {

    constructor(id: string, app: App, sketchBoard: SketchBoard, offset: ICoordiante, sketches = new HumbleArray()) {
        super(id, app, sketchBoard, offset);
        this.state = this.getInitialSketchState(sketches);
    }

    public updateInits(mode = 2) {
        super.updateInits(mode);
        if (mode > 2) {
            for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                this.state.sketches.data[i].updateInits(3);
            }
        }
    }

    public updateSketchOffset() {
        const parentId = this.id.substr(0, this.id.length - 1);
        this.offset.x = this.sketchBoard.calculateSketchOffset(parentId, 0, this.sketchBoard);
        this.offset.y = this.sketchBoard.calculateSketchOffset(parentId, 1, this.sketchBoard);
    }

    public move(left: number, top: number) {
        super.move(left, top);
        this.updateChildOffsets();
    }

    public updateChildOffsets() {
        this.updateSketchOffset();
        for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
            const child = this.state.sketches.data[i];
            if (child instanceof Sketch) {
                child.updateChildOffsets();
            }
        }
    }

    public getOffset(mode: number) {
        if (mode === 0) {
            return this.state.left + this.state.border.width;
        }
        return this.state.top + this.state.border.width;
    }

    public resizeChildren(parentIsOnSketchboard = false) {
        for (let i = 0, len = this.state.sketches.data.length, child = null; i < len; ++i) {
            child = this.state.sketches.data[i];
            child.state.left = (child.initLeft / this.initWidth) * this.state.width;
            child.state.width = (child.initWidth / this.initWidth) * this.state.width;
            if (parentIsOnSketchboard === false) {
                child.state.top = (child.initTop / this.initHeight) * this.state.height;
                child.state.height = (child.initHeight / this.initHeight) * this.state.height;
            }
            if (child instanceof Sketch) {
                child.resizeChildren();
            }
        }
    }

    public render() {
        const inline = {
            background: '',
            borderColor: this.state.border.color,
            borderStyle: this.state.border.style,
            borderWidth: this.state.border.width,
            height: this.state.height,
            left: this.state.left,
            top: this.state.top,
            width: this.state.width,
        }
        if (this.state.refined === true) {
            inline.background = this.state.color;
        }
        if (this.state.border.checked === false) {
            inline.top += inline.borderWidth;
            inline.left += inline.borderWidth;
            inline.borderWidth = 0;
        }
        return (
            <div key={this.id} className="sketch" style={inline} id={this.id}>
                {this.state.sketches.render()}
            </div>
        );
    }

    public convert(): HTMLElement {
        const element = document.createElement("div");
        this.assignStyle(element);
        for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
            const child = this.state.sketches.data[i];
            element.appendChild(child.convert());
        }
        return element;
    }

    protected getInitialSketchState(sketches: HumbleArray): ISketchState {
        const state = super.getInitialState();
        state.sketches = sketches;
        state.color = '#fff';
        state.border = { checked: true, color: '#d0d0d0', width: 1, style: 'solid' };
        state.scroll = 0;
        return state as ISketchState;
    }

    private assignStyle(element: HTMLElement) {
        const parent = this.sketchBoard.findElementById(this.sketchBoard, this.id.substr(0, this.id.length - 1));
        element.style.position = "absolute";
        element.style.top = this.getActuallTop() + "px";
        element.style.left = (this.state.left / parent.state.width) * 100 + "%";
        element.style.width = (this.state.width / parent.state.width) * 100 + "%";
        element.style.height = this.getActuallHeight() + "px";
        element.style.backgroundColor = this.state.color;
        if (this.state.border.checked === true) {
            element.style.borderColor = this.state.border.color;
            element.style.borderWidth = this.state.border.width + "px";
            element.style.borderStyle = this.state.border.style;
        }
    }
}

export default Sketch;