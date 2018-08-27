import React, { Component } from 'react';
import Selctor from '../components/Selector'

class Sketch extends Component {
    constructor(top, left, width=0, height=0) {
        super();
        this.state = {
            top,
            left,
            width,
            height,
            refined: false,
            selected: false
        }
    }

    static addSketchToBoard(sketchBoard, top, left) {
        sketchBoard.selected = new Sketch()
        sketchBoard.sketches.push(sketchBoard.selected);
        sketchBoard.update();
    }

    render() {
        let inline = {
            top: this.state.top+'px',
            left: this.state.left+'px',
            width: this.state.width+'px',
            height: this.state.height+'px'
        }
        if(this.state.refined === true) {
            inline.background = '#fff';
        }
        if(this.state.selected === true) {
            inline.borderColor = '#427fd3';
        }
        return (  
            <div className="sketch" style={inline}>
                {this.state.selected === true ? <Selctor width={this.state.width} height={this.state.height}/> : null}
            </div>  
        );
    }
}

export default Sketch;