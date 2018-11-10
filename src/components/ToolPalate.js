import React, { Component } from 'react';
import toolCollection from '../data/ToolCollection'
import cursor from '../cursor.svg';
import add from '../add.svg';
import Tool from './Tool';

class ToolPalate extends Component {
    /**
     * Changes the active tool to the one provieded to the method.
     * 
     * @param {Tool} tool The tool you want to use.
     * @throws {TypeError} If tool is not instance of Tool.
     */
    setToolTo(tool) {
        if (tool instanceof Tool === false) {
            throw TypeError(`Expected tool to be instance of Tool, ${tool.constructor.name} given.`);
        }
        const sketchBoard = this.props.app.sketchBoard;
        if (sketchBoard.state.tool === tool) {
            return;
        }
        sketchBoard.setState({ tool });
    }

    render() {
        return (
            <div id="tool-palate">
                <nav>
                    <a className="nav-item" onClick={() => { this.setToolTo(toolCollection.Default) }}>
                        <img className="select-icon" src={cursor} alt="Select" />
                    </a>
                    <a className="nav-item" onClick={() => { this.setToolTo(toolCollection.DrawSketch) }}>
                        <img className="sketch-icon" src={add} alt="Sketch" />
                    </a>
                    <a className="nav-item" href="">
                        <img className="sketch-icon" src={add} alt="Icon" />
                    </a>
                    <a className="nav-item" href="">
                        <img className="sketch-icon" src={add} alt="Icon" />
                    </a>
                </nav>
            </div>
        );
    }
}

export default ToolPalate;