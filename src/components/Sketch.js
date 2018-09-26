import React from 'react';
import Element from '../components/Element'
import Selctor from '../components/Selector'
import HumbleArray from '../datatypes/HumbleArray';

class Sketch extends Element {
    constructor(uid, app, sketchBoard, sketches=new HumbleArray()) {
        super(app, sketchBoard);
        this.uid = uid; 
        this.state.sketches = sketches;
    }

    render() {
        let inline = {
            top: this.state.top +'px',
            left: this.state.left +'px',
            width: this.state.width +'px',
            height: this.state.height +'px'
        }
        if(this.state.refined === true) {
            inline.background = '#fff';
        }
        if(this.state.selected === true) {
            inline.borderColor = '#427fd3';
        }
        return (  
            <div className="sketch" style={inline} uid={this.uid} onClick={this.onClick.bind(this)}>
                {this.state.selected === true ? <Selctor app={this.app} setParentState={this.setState.bind(this)} width={this.state.width + 2*this.sketchBoard.state.zoom} height={this.state.height + 2*this.sketchBoard.state.zoom}/> : null}
                {this.state.sketches.render()}
            </div>  
        );
    }
}

export default Sketch;