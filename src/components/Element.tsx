import * as React from 'react';
import App from 'src/App';
import { IElementState } from 'src/datatypes/interfaces';
import Selctor from './Selector'
import SketchBoard from './SketchBoard';

class Element<S extends IElementState> extends React.Component<any, S> {

    public initHeight: number = 0;

    public initLeft: number = 0;

    public initTop: number = 0;

    public initWidth: number = 0;

    public state: S = this.getInitialState();

    constructor(public id: string, public app: App, public sketchBoard: SketchBoard) {
        super({key: id});
        this.setState.bind(this);
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
            <div>
                {this.state.selected === true ? <Selctor sketchBoard={this.sketchBoard} width={this.state.width} height={this.state.height} /> : null}
            </div>
        );
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
}

export default Element;