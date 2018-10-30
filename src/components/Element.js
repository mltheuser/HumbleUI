import React, { Component } from 'react';
import Selctor from '../components/Selector'
import toolCollection from '../data/ToolCollection';

class Element extends Component {
    constructor(app, sketchBoard) {
        super();
        this.app = app;
        this.sketchBoard = sketchBoard;
        this.updateSelection = sketchBoard.updateSelection.bind(sketchBoard);
        this.state = {
            top: app.state.tool.mouseState.startY,
            initTop: app.state.tool.mouseState.startY,
            left: app.state.tool.mouseState.startX,
            initLeft: app.state.tool.mouseState.startX,
            width: 0,
            initWidth: 0,
            height: 0,
            initHeight: 0,
            refined: false,
            selected: false
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
    updateInits(mode=2) {
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
        if(mode > 2)
            for(let i=0, len=this.state.sketches.data.length; i<len; ++i)
                this.state.sketches.data[i].updateInits(3);
    }

    resizeChildren() {
        for(let i=0, len=this.state.sketches.data.length, child=null; i<len; ++i) {
            child = this.state.sketches.data[i];
            child.state.left = (child.state.initLeft / this.state.initWidth) * this.state.width;
            child.state.width = (child.state.initWidth / this.state.initWidth) * this.state.width;
            child.resizeChildren();
        }
    }

    onClick(e) {
        e.stopPropagation()
        if (this.app.state.tool !== toolCollection.Default)
            return;
        this.updateSelection(e.target);
    }

    render() {
        return (  
            <div>
                {this.state.selected === true ? <Selctor app={this.app} setParentState={this.setState.bind(this)} width={this.state.width} height={this.state.height}/> : null}
            </div>  
        );
    }
}

export default Element;