import React, { Component } from 'react';
import ToolPalate from './components/ToolPalate'
import Info from './components/Info'
import SketchBoard from './components/SketchBoard';

class App extends Component {
    render() {
        return (
            <div className="container">
                <div className="layout">
                    <div className="layout-top-bar"></div>
                    <div className="layout-content">
                        <ToolPalate/>
                        <SketchBoard/>
                        <Info/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;