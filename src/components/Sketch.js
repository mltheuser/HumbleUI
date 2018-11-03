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

    resizeChildren(parentIsOnSketchboard=false) {
        for(let i=0, len=this.state.sketches.data.length, child=null; i<len; ++i) {
            child = this.state.sketches.data[i];
            child.state.left = (child.state.initLeft / this.state.initWidth) * this.state.width;
            child.state.width = (child.state.initWidth / this.state.initWidth) * this.state.width;
            if(parentIsOnSketchboard === false) {
                child.state.top = (child.state.initTop / this.state.initHeight) * this.state.height;
                child.state.height = (child.state.initHeight / this.state.initHeight) * this.state.height;
            }
            child.resizeChildren();
        }
    }

    render() {
        let inline = {
            top: this.state.top,
            left: this.state.left,
            width: this.state.width,
            height: this.state.height,
        }

        if(this.state.refined === true) {
            inline.background = '#fff';
        }
        if(this.state.selected === true) {
            inline.borderColor = '#427fd3';
        }
        return (  
            <div className="sketch" style={inline} uid={this.uid} onClick={this.onClick.bind(this)}>
                {this.state.selected === true ? <Selctor app={this.app} setParentState={this.setState.bind(this)} width={inline.width} height={inline.height}/> : null}
                <div className="sketchContainer" uid={this.uid}>
                    {this.state.sketches.render()}
                </div>
            </div>  
        );
    }
}

export default Sketch;