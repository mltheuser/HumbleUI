import React, { Component } from 'react';
import toolCollection from '../data/ToolCollection'

class Selector extends Component {
    constructor() {
        super();
        this.toolRepo = null;
    }
    componentDidMount() {
        let tmp = document.getElementsByClassName('selector'), len = tmp.length, i = 0;
        for (; i < len; ++i) {
            tmp[i].addEventListener('mouseleave', () => {
                const tool = this.props.sketchBoard.state.tool
                if(tool.toolRepo === null || tool.mouseState.down === true)
                    return;
                this.props.sketchBoard.setState({tool: tool.toolRepo});
                tool.toolRepo = null;
            }, false);
        }
    }

    handleMouseEnter(horizontalMode, verticalMode, selectorID) {
        if(this.props.sketchBoard.state.tool === toolCollection.Resize)
            return;
        toolCollection.Resize.toolRepo = this.props.sketchBoard.state.tool;
        toolCollection.Resize.horizontal = horizontalMode; 
        toolCollection.Resize.vertical = verticalMode;
        toolCollection.Resize.selectorID = selectorID;
        this.props.sketchBoard.setState({tool: toolCollection.Resize});
    }

    render() {
        let inline1 = {
            marginRight: (this.props.width/2 - 8)+'px',
        }
        let inline2 = {
            top: (this.props.height/2 - 5 - 9)+'px'
        }
        let inline3 = {
            top: (this.props.height/2 - 5 - 2*9)+'px'
        }
        let inline4 = {
            top: (this.props.height - 23)+'px',
            cursor: 'nesw-resize'
        }
        let inline5 = {
            top: (this.props.height - 32)+'px',
            cursor: 'nwse-resize'
        }
        let inline6 = {
            top: (this.props.height - 32)+'px',
            marginRight: (this.props.width/2 - 8)+'px'
        }
        return (  
            <div className="selectCage">
                <div id="selector-top-left" className="selector left" onMouseEnter={(e) => {this.handleMouseEnter(1, 1, 'selector-top-left');}}></div>  
                <div id="selector-top-right" className="selector right" onMouseEnter={(e) => {this.handleMouseEnter(2, 1, 'selector-top-right');}}></div> 
                <div id="selector-top-middle" className="selector middel middel-horizontal" style={inline1} onMouseEnter={(e) => {this.handleMouseEnter(0, 1, 'selector-top-middle');}}></div>
                <div id="selector-middle-left" className="selector left middel-vertical" style={inline2} onMouseEnter={(e) => {this.handleMouseEnter(1, 0, 'selector-middle-left');}}></div>
                <div id="selector-middle-right" className="selector right middel-vertical" style={inline3} onMouseEnter={(e) => {this.handleMouseEnter(2, 0, 'selector-middle-right');}}></div> 
                <div id="selector-bottom-left" className="selector left" style={inline4} onMouseEnter={(e) => {this.handleMouseEnter(1, 2, 'selector-bottom-left');}}></div>
                <div id="selector-bottom-right" className="selector right" style={inline5} onMouseEnter={(e) => {this.handleMouseEnter(2, 2, 'selector-bottom-right');}}></div>
                <div id="selector-bottom-middle" className="selector middel middel-horizontal" style={inline6} onMouseEnter={(e) => {this.handleMouseEnter(0, 2, 'selector-bottom-middle');}}></div>
            </div>
        );
    }
}

export default Selector;