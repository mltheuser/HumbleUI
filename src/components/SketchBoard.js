import React, { Component } from 'react';
import HumbleArray from '../datatypes/HumbleArray'

class SketchBoard extends Component {
    constructor() {
        super();
        this.state = {
            selected: null,
            sketches: new HumbleArray(),

            top: 4,
            left: 0,

            zoom: 0
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
        console.log(e.deltaY);
        console.log(this);
        const update = e.deltaY/4;
        this.setState((prevState) => {
            return {
                zoom: prevState.zoom + update
            }
        })
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