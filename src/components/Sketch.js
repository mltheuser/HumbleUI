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
    
    updateChildren() {
        for(let i=0, len=this.state.sketches.data.length; i<len; ++i) {

            this.state.sketches.data[i].state.top += this.state.top - this.state.initTop;
            this.state.sketches.data[i].state.left += this.state.left - this.state.initLeft;
            this.state.sketches.data[i].state.width += this.state.width - this.state.initWidth;
            this.state.sketches.data[i].state.height += this.state.height - this.state.initHeight;

            this.state.sketches.data[i].updateChildren();
        }
        this.updateInits(2);
    }

    /*calculateVerticalZoomOffset() { //prototyp
        let offset = [0, 0];
        for(let i=0, len=this.sketchBoard.state.sketches.data.length; i<len; ++i) {
            const e = this.sketchBoard.state.sketches.data[i];

            if(e === this)
                continue;

            // calculate the vertical distance between this sketch and its sibling
            const dist1 = e.state.left - (this.state.left + this.state.width), dist2 = (e.state.left + e.state.width) - this.state.left;
            const distance = Math.abs(dist1) < Math.abs(dist2) ? dist1 : dist2;

            const distanceUpdate = (Math.abs((distance * this.sketchBoard.state.zoom - distance)) + ((this.state.width * this.sketchBoard.state.zoom - this.state.width)/2) + ((e.state.width * this.sketchBoard.state.zoom - e.state.width)/2))/2;

            if(distance >= 0) {
                // push the sketch left by (|distanceUpdate| + thisVerticalUpdate/2 + eVerticalUpdate/2)/2
                offset[0] -= distanceUpdate;
            } else {
                // push the sketch right
                offset[0] += distanceUpdate;
                offset[1] += distanceUpdate;
            }
        }
        return offset;
    }*/

    render() {
        let inline = {
            top: this.state.top ,
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
                {this.state.sketches.render()}
            </div>  
        );
    }
}

export default Sketch;