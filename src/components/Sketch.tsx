import * as React from 'react';
import App from 'src/App';
import HumbleArray from '../datatypes/HumbleArray';
import Element, { IElementState } from './Element'
import Selctor from './Selector'
import SketchBoard from './SketchBoard';

interface IBorder {
    checked: boolean,
    color: string,
    width: string,
    style: string,
}

interface ISketchState extends IElementState {
    sketches: HumbleArray,
    color: string,
    border: IBorder,
}

class Sketch extends Element<ISketchState> {
    constructor(id: string, app: App, sketchBoard: SketchBoard, sketches = new HumbleArray()) {
        super(id, app, sketchBoard);
        this.state = this.getInitialSketchState(sketches);
    }

    /**
     * Updates the states initial values depending on the choosen mode.
     * 0: updates top and left,
     * 1: updates width and height,
     * 2: updates both pairs
     * 3: update both pairs and all children
     * 
     * @param {Integer} mode Defines what should be updated.
     */
    public updateInits(mode = 2) {
        super.updateInits(mode);
        if (mode > 2) {
            for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                this.state.sketches.data[i].updateInits(3);
            }
        }
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
            child.resizeChildren();
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
        if (this.state.selected === true) {
            inline.borderColor = '#427fd3';
        } else if (this.state.border.checked === false) {
            inline.borderColor = this.state.color;
        }
        return (
            <div className="sketch" style={inline} id={this.id}>
                {this.state.selected === true ? <Selctor sketchBoard={this.sketchBoard} width={inline.width} height={inline.height} /> : null}
                <div className="sketchContainer" id={this.id}>
                    {this.state.sketches.render()}
                </div>
            </div>
        );
    }

    private getInitialSketchState(sketches: HumbleArray): ISketchState {
        const state = super.getInitialState();
        state.sketches = sketches;
        state.color = '#fff';
        state.border = { checked: true, color: '#d0d0d0', width: '1px', style: 'solid' };
        return state as ISketchState;
    }
}

export default Sketch;