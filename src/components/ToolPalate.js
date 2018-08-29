import React, { Component } from 'react';
import toolCollection from '../data/ToolCollection'
import cursor from '../cursor.svg';
import add from '../add.svg';

class ToolPalate extends Component {
    render() {
        const inline1 = {
            height: '24px',
            paddingLeft: '4px'
        };
        return (  
            <div className="tool-palate">
                <nav className="mdl-navigation">
                    <a className="nav-item" onClick={() => {this.props.app.updateTool(toolCollection.Default)}}>
                        <img className="test5" style={inline1} src={cursor} alt="Icon"/>
                    </a>
                    <a className="nav-item" onClick={() => {this.props.app.updateTool(toolCollection.DrawSketch)}}>
                        <img className="test5" src={add} alt="Icon"/>
                    </a>
                    <a className="nav-item" href="">
                        <img className="test5" src={add} alt="Icon"/>
                    </a>
                    <a className="nav-item" href="">
                        <img className="test5" src={add} alt="Icon"/>
                    </a>
                </nav>
            </div>  
        );
    }
}

export default ToolPalate;