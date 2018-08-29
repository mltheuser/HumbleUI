import React, { Component } from 'react';
import ToolPalate from './components/ToolPalate'
import Info from './components/Info'
import SketchBoard from './components/SketchBoard';
import toolCollection from './data/ToolCollection'
import Tool from './components/Tool';

class App extends Component {
    constructor() {
        super();
        this.state = {
            tool: toolCollection.Default
        }
    }

    updateTool(tool) {
        if(!(tool instanceof Tool))
            throw Error('Expected tool to be instance of Tool');
        this.setState({tool});
    }

    render() {
        this.updateTool = this.updateTool.bind(this);
        const inline1 = {
            cursor: this.state.tool.cursor
        }
        return (
            <div className="container" style={inline1}>
                <div className="layout">
                    <div className="layout-top-bar"></div>
                    <div className="layout-content">
                        <ToolPalate app={this}/>
                        <SketchBoard app={this}/>
                        <Info/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;