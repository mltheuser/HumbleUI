import React, { Component } from 'react';
import HumbleArray from './HumbleArray'

class SketchBoard extends Component {
    constructor() {
        super();
        this.state = {
            selected: null,
            sketches: new HumbleArray()
        }
    }

    render() {
        return (  
            <main onMouseDown={this.props.tool.handleMouseDown.bind(this)} onMouseMove={this.props.tool.handleMouseMove.bind(this)} onMouseUp={this.props.tool.handleMouseUp.bind(this)}>
                {this.state.sketches.render()}
            </main>
        );
    }
}

export default SketchBoard;