import React, { Component } from 'react';
import ToolPalate from './components/ToolPalate'
import Info from './components/Info'
import SketchBoard from './components/SketchBoard';

class App extends Component {
    constructor() {
        super();

        this.selected = null;

        this.state = {
            sketchBoard: {
                selected: null,
                sketches: [],
                update: () => {
                    this.setState({
                        sketchBoard: this.state.sketchBoard
                    });
                }
            }
        }
    }

    addSketch(top, left) {
        this.selected = {initTop: top, initLeft: left, top: top, left: left}
        this.state.sketches.push(this.selected);
        this.setState({
            sketches: this.state.sketches
        });
    }

    updateSketch(width, height, top, left) {
        this.selected.width = width;
        this.selected.height = height;
        if(top !== null)
            this.selected.top = this.selected.initTop + top;
        if(left !== null)
            this.selected.left = this.selected.initLeft + left;
        console.log(this.selected);
        this.setState({
            sketches: this.state.sketches
        });
    }

    refineSketch() {
        this.selected.refined = true;
        this.selected.selected = true;
        this.setState({
            sketches: this.state.sketches
        });
    }

    render() {
        return (
            <div className="container">
                <div className="layout">
                    <div className="layout-top-bar"></div>
                    <div className="layout-content">
                        <ToolPalate/>
                        <SketchBoard self={this.state.sketchBoard}/>
                        <Info/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;