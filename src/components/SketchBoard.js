import React, { Component } from 'react';
import HumbleArray from '../datatypes/HumbleArray'

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
            <main onMouseDown={this.props.app.state.tool.handleMouseDown.bind(this)} onMouseMove={this.props.app.state.tool.handleMouseMove.bind(this)} onMouseUp={this.props.app.state.tool.handleMouseUp.bind(this)}>
                {this.state.sketches.render()}
            </main>
        );
    }
}

export default SketchBoard;