import React, { Component } from 'react';
import Selctor from '../components/Selector'

class Sketch extends Component {
    constructor(app) {
        super();
        this.app = app;
        this.state = {
            top: app.state.tool.mouseState.startY,
            left: app.state.tool.mouseState.startX,
            initTop: app.state.tool.mouseState.startY,
            initLeft: app.state.tool.mouseState.startX,
            width: 0,
            height: 0,
            refined: false,
            selected: false
        }
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
                {this.state.selected === true ? <Selctor app={this.app} setParentState={this.setState.bind(this)} width={this.state.width} height={this.state.height}/> : null}
            </div>  
        );
    }
}

export default Sketch;