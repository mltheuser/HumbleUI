import React, { Component } from 'react';
import Sketch from './Sketch';
import HumbleArray from './HumbleArray'

class SketchBoard extends Component {
    constructor() {
        super();
        this.mousePositions = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        }
        this.mouseDown = false;
        this.state = {
            selected: null,
            sketches: new HumbleArray()
        }
    }

    handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        // save the starting x/y of the rectangle
        this.mousePositions.startX = parseInt(e.clientX, 10);
        this.mousePositions.startY = parseInt(e.clientY, 10) - 4;

        this.setState((prevState) => {
            const tmp = new Sketch(this.mousePositions.startY, this.mousePositions.startX);
            prevState.sketches.push(tmp);
            return {
                selected: tmp,
                sketches: prevState.sketches
            };
        });

        this.mouseDown = true;
    }

    handleMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();

        // if we're not dragging, just return
        if (this.mouseDown === false)
            return;

        // get the current mouse position
        this.mousePositions.currentX = parseInt(e.clientX, 10);
        this.mousePositions.currentY = parseInt(e.clientY, 10) - 4;

        // Put your mousemove stuff here

        // calculate the rectangle width/height based
        // on starting vs current mouse position
        var width = this.mousePositions.currentX - this.mousePositions.startX;
        var height = this.mousePositions.currentY - this.mousePositions.startY;

        let top = null, left = null;

        if (width < 0)
            left = width

        if (height < 0)
            top = height

        this.setState((prevState) => {
            prevState.selected.state.width = Math.abs(width);
            prevState.selected.state.height = Math.abs(height);
            if(top !== null)
                prevState.selected.state.top = prevState.selected.state.initTop + top;
            if(left !== null)
                prevState.selected.state.left = prevState.selected.state.initLeft + left;
            return {
                selected: prevState.selected
            }
        });
    }

    handleMouseUp(e) {
        e.preventDefault();
        e.stopPropagation();

        // the drag is over, clear the dragging flag
        this.mouseDown = false;

        this.setState((prevState) => {
            prevState.selected.state.refined = true;
            prevState.selected.state.selected = true;
            return {
                selected: prevState.selected
            }
        });
    }

    render() {
        return (  
            <main onMouseDown={this.handleMouseDown.bind(this)} onMouseMove={this.handleMouseMove.bind(this)} onMouseUp={this.handleMouseUp.bind(this)}>
                {this.state.sketches.render()}
            </main>
        );
    }
}

export default SketchBoard;