import React, { Component } from 'react';
import HumbleArray from '../datatypes/HumbleArray'

class SketchBoard extends Component { // Consider Sketchboard as an Element
    constructor() {
        super();
        this.state = {
            selected: null,

            sketches: new HumbleArray(),
            distances: new HumbleArray(),

            top: 4,
            left: 0,

            zoom: 1,
        }
    }

    updateSelection(element) {
        // find the uid of the next selection in the sketchtree
        let i=0;
        const targetUid = element.getAttribute("uid"), len = targetUid.length, len2=this.state.selected.uid.length;
        for(; i<len; ++i)
            if(i === len2 || targetUid.charAt(i) !== this.state.selected.uid.charAt(i))
                break;

        element = this.findSketchByUid(this, targetUid.substring(0, i+1));

        this.setState((prevState) => {
            prevState.selected.state.selected = false;
            element.state.selected = true;
            return {
                selected: element
            }
        })
    }

    findSketchByUid(searchSpace, uid) {
        return uid.length === 1 ? searchSpace.state.sketches.data[uid] : this.findSketchByUid(searchSpace.state.sketches.data[uid.charAt(0)], uid.substring(1));
    }

    getSketchOffset(uid, offset, searchSpace=this, sum=0) {
        return uid.length === 0 ? sum + searchSpace.state[offset] : this.getSketchOffset(uid.substring(1), offset, searchSpace.state.sketches.data[uid.charAt(0)], sum + searchSpace.state[offset]);
    }

    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll.bind(this), true);
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll.bind(this), true);
    }

    handleScroll(e) {
        const zoomUpdate = e.deltaY/Math.abs(e.deltaY)*0.2;
        // update all sketches according to new zoom

        for(let i=0, len=this.state.sketches.data.length; i<len; ++i) {
            const sketch = this.state.sketches.data[i];
            sketch.updateInits();
        }

        for(let i=0, len=this.state.sketches.data.length; i<len; ++i) {
            const sketch = this.state.sketches.data[i];

            const verticalUpdate = sketch.state.initWidth * zoomUpdate;
            const horizontalUpdate = sketch.state.initHeight * zoomUpdate;

            // zoom the object
            sketch.state.top -= horizontalUpdate/2;
            sketch.state.left -= verticalUpdate/2;
            sketch.state.height += horizontalUpdate;
            sketch.state.width += verticalUpdate;

            for(let z=0; z<len; ++z) {
                if(i === z)
                    continue;
                const sibling = this.state.sketches.data[z];

                 // calculate the vertical distance between this sketch and its sibling
                const dist1 = sibling.state.initLeft - (sketch.state.initLeft + sketch.state.initWidth), dist2 = (sibling.state.initLeft + sibling.state.initWidth) - sketch.state.initLeft;
                const distance = Math.abs(dist1) < Math.abs(dist2) ? dist1 : dist2;

                const distanceUpdate = (Math.abs(distance) * zoomUpdate + verticalUpdate/2 + (sibling.state.initWidth * zoomUpdate)/2)/2;

                if(distance >= 0) {
                    // push the sketch left by (|distanceUpdate| + thisVerticalUpdate/2 + eVerticalUpdate/2)/2
                    sketch.state.left -= distanceUpdate;
                } else {
                    console.log('mach mich dicker');
                    // push the sketch right
                    sketch.state.left += distanceUpdate;
                    sketch.state.width += distanceUpdate;
                }
            }
        }

        this.setState((prevState) => {
            return {
                zoom: prevState.zoom + zoomUpdate
            }
        });
    }

    zoomUpdate() {
        return this.state.zoom * 500 - 500;
    }

    render() {
        return (  
            <main onMouseDown={this.props.app.state.tool.handleMouseDown.bind(this)} onMouseMove={this.props.app.state.tool.handleMouseMove.bind(this)} onMouseUp={this.props.app.state.tool.handleMouseUp.bind(this)}>
                {this.state.sketches.render()}
            </main>
        );
    }
}

export default SketchBoard;