import React, { Component } from 'react';
import HumbleArray from '../datatypes/HumbleArray'
import toolCollection from '../data/ToolCollection';

class SketchBoard extends Component { // Consider Sketchboard as an Element
    constructor(props) {
        super();
        props.app.sketchBoard = this;
        this.state = {
            selected: null,

            sketches: new HumbleArray(),
            distances: new HumbleArray(),

            top: 4,
            left: 0,

            tool: toolCollection.Default,

            zoom: 1
        }
    }

    updateInits(mode=2) {
        for(let i=0, len=this.state.sketches.data.length; i<len; ++i)
            this.state.sketches.data[i].updateInits(mode);
    }

    updateSelection(element) {
        if(element === this.state.selected)
            return;
        if(element !== null) {
            // find the uid of the next selection in the sketchtree
            let i=0;
            const targetUid = element.uid, len = targetUid.length, len2=(this.state.selected === null ? 0 : this.state.selected.uid.length);
            for(; i<len; ++i)
                if(i === len2 || targetUid.charAt(i) !== this.state.selected.uid.charAt(i))
                    break;

            element = this.findSketchByUid(this, targetUid.substring(0, i+1));
            element.state.selected = true;
        }

        this.setState((prevState) => {
            if(prevState.selected !== null)
                prevState.selected.state.selected = false;
            return {
                selected: element
            }
        });

        this.props.app.setState({});
    }

    findSketchByUid(searchSpace, uid) {
        return uid.length === 1 ? searchSpace.state.sketches.data[uid] : this.findSketchByUid(searchSpace.state.sketches.data[uid.charAt(0)], uid.substring(1));
    }

    getSketchOffset(uid, offset, searchSpace=this, sum=0) {
        return uid.length === 0 ? sum + searchSpace.state[offset] : this.getSketchOffset(uid.substring(1), offset, searchSpace.state.sketches.data[uid.charAt(0)], sum + searchSpace.state[offset]);
    }

    getCenter() {
        const main = document.getElementById('main'), toolpalate = document.getElementById('tool-palate'), info = document.getElementById('info');
        return {x: toolpalate.offsetWidth + (main.offsetWidth - info.offsetWidth - toolpalate.offsetWidth)/2, y: main.offsetHeight/2};
    }

    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll.bind(this), {passive: true});
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll.bind(this), {passive: true});
    }

    zoomDomainElements(domain, newZoom, repositionVector=null) {
        for(let i=0, len=domain.state.sketches.data.length; i<len; ++i) {
            domain.state.sketches.data[i].state.top = (domain.state.sketches.data[i].state.top/this.state.zoom) * newZoom + (repositionVector === null ? 0 : repositionVector.y);
            domain.state.sketches.data[i].state.left = (domain.state.sketches.data[i].state.left/this.state.zoom) * newZoom + (repositionVector === null ? 0 : repositionVector.x);
            domain.state.sketches.data[i].state.height = (domain.state.sketches.data[i].state.height/this.state.zoom) * newZoom;
            domain.state.sketches.data[i].state.width = (domain.state.sketches.data[i].state.width/this.state.zoom) * newZoom;
            this.zoomDomainElements(domain.state.sketches.data[i], newZoom);
        }
    }

    handleScroll(e) {  
        // calculate distance between center and newCursor
        const center = this.getCenter(), newZoom = this.state.zoom + e.deltaY/400, newCursor = {x: e.clientX / this.state.zoom * newZoom, y: (e.clientY - this.state.top) / this.state.zoom * newZoom};
        const dist = {x: center.x - newCursor.x, y: center.y - newCursor.y};

        // zoom in on all Sketches and make the cursorLocation the new center. Update the zoom afterwards.
        this.setState((prevState) => {
            this.zoomDomainElements(this, newZoom, dist);
            return {
                zoom: newZoom
            }
        });
    }

    render() {
        const inline = {
            cursor: this.state.tool.cursor
        }
        return (  
            <main id="main" style={inline} onMouseDown={this.state.tool.handleMouseDown.bind(this)} onMouseMove={this.state.tool.handleMouseMove.bind(this)} onMouseUp={this.state.tool.handleMouseUp.bind(this)}>
                {this.state.sketches.render()}
            </main>
        );
    }
}

export default SketchBoard;