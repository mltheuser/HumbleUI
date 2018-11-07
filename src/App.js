import React, { Component } from 'react';
import ToolPalate from './components/ToolPalate'
import SketchBoard from './components/SketchBoard';
import Info from './components/Info';

class App extends Component {
    constructor() {
        super();
        this.state = {
            // will be filled in the sketchBoards constructor
            sketchBoard: null 
        }
    }

    render() {
        return (
            <div className="container">
                <div className="layout">
                    <div className="layout-top-bar"></div>
                    <div className="layout-content">
                        <ToolPalate app={this}/>
                        <SketchBoard app={this}/>
                        <Info app={this}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;