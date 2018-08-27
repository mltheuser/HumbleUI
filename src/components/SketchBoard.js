import React, { Component } from 'react';
import Sketch from './Sketch';

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
            selected: new Sketch(100, 100, 100, 100),
            sketches: []
        }
        console.log(this.state.selected);
    }

    handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

        // save the starting x/y of the rectangle
        this.mousePositions.startX = parseInt(e.clientX, 10);
        this.mousePositions.startY = parseInt(e.clientY, 10) - 4;

        console.log(this)

        console.log(this.state.selected)

        this.setState((prevState) => {
            prevState.selected.state.height = 2000;
            return {selected: prevState.selected};
        });

        /*
        const tmp = new Sketch({top: this.mousePositions.startY, left: this.mousePositions.startX, width: 10, height: 10});
        this.state.sketches.push(tmp);

        this.setState({
            selected: tmp,
            sketches: this.state.sketches
        })
        */

        this.mouseDown = true;
    }

    handleMouseMove(e) {
        /*
        e.preventDefault();
        e.stopPropagation();

        // if we're not dragging, just return
        if (this.mouseDown === false)
            return;

        // get the current mouse position
        this.mousePositions.currentX = parseInt(e.clientX, 10);
        this.mousePositions.currentY = parseInt(e.clientY, 10) - 4;

        console.log('current position: (X:'+this.mousePositions.currentX+'Y:'+this.mousePositions.currentY+')');

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

        this.props.updateSketch(Math.abs(width), Math.abs(height), top, left);
        */
    }

    handleMouseUp(e) {
        /*
        e.preventDefault();
        e.stopPropagation();

        // the drag is over, clear the dragging flag
        this.mouseDown = false;

        this.props.refineSketch();
        */
    }

    unpackSketches(sketches) {
        let i=0, len=sketches.length, tmp = new Array(len);
        for(; i < len; ++i)
            tmp[i] = <Sketch params={sketches[i]}/>;
        return tmp;
    }

    render() {
        return (  
            <main onMouseDown={this.handleMouseDown.bind(this)} onMouseMove={this.handleMouseMove.bind(this)} onMouseUp={this.handleMouseUp.bind(this)}>
                {this.state.selected.render()}
            </main>
        );
    }
}

export default SketchBoard;