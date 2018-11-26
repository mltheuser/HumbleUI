import * as React from 'react';
import App from 'src/App';
import { ISketchState } from 'src/datatypes/interfaces';
import HumbleArray from '../datatypes/HumbleArray';
import Element from './Element'
import Selctor from './Selector'
import SketchBoard from './SketchBoard';

class Sketch extends Element<ISketchState> {

    constructor(id: string, app: App, sketchBoard: SketchBoard, sketches = new HumbleArray()) {
        super(id, app, sketchBoard);
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

    public handleScroll(event: any) {
        let update = - event.deltaY / (this.sketchBoard.state.zoom * 4);
        if (this.state.scroll + update > 0) {
            update = -this.state.scroll;
        }
        this.state.scroll += update;
        for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
            this.state.sketches.data[i].state.top += update;
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
            <div key={this.id} className="sketch" style={inline} id={this.id}>
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
        state.scroll = 0;
        return state as ISketchState;
    }
}

export default Sketch;