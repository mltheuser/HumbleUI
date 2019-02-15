import { IconButton } from '@material-ui/core';
import * as React from 'react';
import toolCollection from '../data/ToolCollection'
import { SketchBoard } from './Board/SketchBoard';
import Tool from './Tool';

class ToolPalate extends React.Component {

    public state = {
        selectedTool: toolCollection.Default,
    }

    public constructor(props = {}) {
        super(props);
        this.setToolToDefault = this.setToolToDefault.bind(this);
        this.setToolToDrawSketch = this.setToolToDrawSketch.bind(this);
        this.colorFromIsCurrentTool = this.colorFromIsCurrentTool.bind(this);
    }

    public render() {
        return (
            <div id="tool-palate">
                <nav>
                    <IconButton color="inherit" className="nav-item" onClick={this.setToolToDefault}>
                        <svg width="24px" height="24px" viewBox="0 0 297.001 297.001">
                            <path d="M290.444,119.548L14.488,0.818C10.721-0.805,6.343,0.032,3.436,2.93c-2.904,2.898-3.753,7.272-2.142,11.046l118.314,276.933
                                c1.581,3.698,5.212,6.092,9.227,6.092c0.033,0,0.065,0,0.1,0c4.053-0.04,7.684-2.515,9.203-6.272l43.921-108.598l108.205-44.074
                                c3.745-1.524,6.208-5.15,6.248-9.194C296.551,124.818,294.159,121.146,290.444,119.548z" fill={this.colorFromIsCurrentTool(toolCollection.Default)}/>
                        </svg>
                    </IconButton>     
                    <IconButton color="inherit" className="nav-item" onClick={this.setToolToDrawSketch}>
                        <svg enableBackground="new 0 0 24 24" height="24px" id="icons" version="1.1" viewBox="0 0 24 24" width="24px">
                            <g>
                                <polygon fill={this.colorFromIsCurrentTool(toolCollection.DrawSketch)} points="21,13 19,13 19,19 2,19 2,8 14,8 14,6 0,6 0,21 21,21  "/>
                                <polygon fill={this.colorFromIsCurrentTool(toolCollection.DrawSketch)} points="21,3 19,3 19,6 16,6 16,8 19,8 19,11 21,11 21,8 24,8 24,6 21,6  "/>
                            </g>
                        </svg>
                    </IconButton>
                    <IconButton color="inherit" className="nav-item" onClick={this.setToolToDrawSketch}>
                        <svg enableBackground="new 0 0 24 24" height="24px" id="icons" version="1.1" viewBox="0 0 24 24" width="24px">
                            <g>
                                <polygon fill="#757575" points="21,13 19,13 19,19 2,19 2,8 14,8 14,6 0,6 0,21 21,21  "/>
                                <polygon fill="#757575" points="21,3 19,3 19,6 16,6 16,8 19,8 19,11 21,11 21,8 24,8 24,6 21,6  "/>
                            </g>
                        </svg>
                    </IconButton>
                    <IconButton color="inherit" className="nav-item" onClick={this.setToolToDrawSketch}>
                        <svg enableBackground="new 0 0 24 24" height="24px" id="icons" version="1.1" viewBox="0 0 24 24" width="24px">
                            <g>
                                <polygon fill="#757575" points="21,13 19,13 19,19 2,19 2,8 14,8 14,6 0,6 0,21 21,21  "/>
                                <polygon fill="#757575" points="21,3 19,3 19,6 16,6 16,8 19,8 19,11 21,11 21,8 24,8 24,6 21,6  "/>
                            </g>
                        </svg>
                    </IconButton>
                </nav>
            </div>
        );
    }

    private setToolToDefault() {
        this.setToolTo(toolCollection.Default);
    }

    private setToolToDrawSketch() {
        this.setToolTo(toolCollection.DrawSketch);
    }

    private setToolTo(tool: Tool) {
        const sketchBoard = SketchBoard.getInstance();
        if (sketchBoard.state.tool === tool) {
            return;
        }
        this.setState({ selected: tool });
        sketchBoard.setState({ tool });
    }

    private colorFromIsCurrentTool(tool: Tool) {
        if(this.state.selectedTool === tool) {
            return '#427fd3';
        }
        return 'rgba(0, 0, 0, 0.54)';
    }
}

export default ToolPalate;