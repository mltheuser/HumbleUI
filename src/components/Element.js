import React, { Component } from 'react';
import Selctor from '../components/Selector'
import toolCollection from '../data/ToolCollection';

class Element extends Component {
    constructor(app, sketchBoard) {
        super();
        this.app = app;
        this.sketchBoard = sketchBoard;
        this.state = {
            height: 0,
            initHeight: 0,
            initLeft: sketchBoard.state.tool.mouseState.startX,
            initTop: sketchBoard.state.tool.mouseState.startY,
            initWidth: 0,
            left: sketchBoard.state.tool.mouseState.startX,
            refined: false,
            selected: false,
            top: sketchBoard.state.tool.mouseState.startY,
            width: 0,
        }
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
    updateInits(mode = 2) {
        if (mode > 0) {
            // eslint-disable-next-line
            this.state.initHeight = this.state.height
            // eslint-disable-next-line
            this.state.initWidth = this.state.width;
        }
        if (mode !== 1) {
            // eslint-disable-next-line
            this.state.initTop = this.state.top;
            // eslint-disable-next-line
            this.state.initLeft = this.state.left;
        }
        if (mode > 2) {
            for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                this.state.sketches.data[i].updateInits(3);
            }
        }
    }

    canItersectByHeightWith(element) {
        if (element instanceof Element === false) {
            throw new Error('Expected element to be instance of Element.');
        }
        return ((this.state.top >= element.state.top && this.state.top <= element.state.top + element.state.height) || (this.state.top + this.state.height >= element.state.top && this.state.top + this.state.height <= element.state.top + element.state.height)) || ((element.state.top >= this.state.top && element.state.top <= this.state.top + this.state.height) || (element.state.top + element.state.height >= this.state.top && element.state.top + element.state.height <= this.state.top + this.state.height));
    }

    canItersectByWidthWith(element) {
        if (element instanceof Element === false) {
            throw new Error('Expected element to be instance of Element.');
        }
        return ((this.state.left >= element.state.left && this.state.left <= element.state.left + element.state.width) || (this.state.left + this.state.width >= element.state.left && this.state.left + this.state.width <= element.state.left + element.state.width)) || ((element.state.left >= this.state.left && element.state.left <= this.state.left + this.state.width) || (element.state.left + element.state.width >= this.state.left && element.state.left + element.state.width <= this.state.left + this.state.width));
    }

    /**
     * Checks if element is a child of this or this itself.
     * @param {Element} element 
     */
    isFamilyMemberOf(element) {
        if (element instanceof Element === false) {
            throw new Error('Expected element to be instance of Element.');
        }
        for (let i = 0, len = element.uid.length, len2 = this.uid.length; i < len; ++i) {
            if (i >= len2 || this.uid[i] !== element.uid[i]) {
                return false;
            }
        }
        return true
    }

    onClick(e) {
        e.stopPropagation()
        if (this.sketchBoard.state.tool !== toolCollection.Default) {
            return;
        }
    }

    render() {
        return (
            <div>
                {this.state.selected === true ? <Selctor sketchBoard={this.sketchBoard} setParentState={this.setState.bind(this)} width={this.state.width} height={this.state.height} /> : null}
            </div>
        );
    }
}

export default Element;