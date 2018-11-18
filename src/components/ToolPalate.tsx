import * as React from 'react';
import { IAppProps } from 'src/datatypes/interfaces';
import toolCollection from '../data/ToolCollection'
import Tool from './Tool';

class ToolPalate extends React.Component<IAppProps, any> {

    public constructor(props:IAppProps) {
        super(props);
        this.setToolToDefault = this.setToolToDefault.bind(this);
        this.setToolToDrawSketch = this.setToolToDrawSketch.bind(this);
    }

    public render() {
        return (
            <div id="tool-palate">
                <nav>
                    <a className="nav-item" onClick={this.setToolToDefault}>
                        <svg className="select-icon" viewBox="0 0 297.001 297.001">
                            <path d="M290.444,119.548L14.488,0.818C10.721-0.805,6.343,0.032,3.436,2.93c-2.904,2.898-3.753,7.272-2.142,11.046l118.314,276.933
                                c1.581,3.698,5.212,6.092,9.227,6.092c0.033,0,0.065,0,0.1,0c4.053-0.04,7.684-2.515,9.203-6.272l43.921-108.598l108.205-44.074
                                c3.745-1.524,6.208-5.15,6.248-9.194C296.551,124.818,294.159,121.146,290.444,119.548z" fill="rgba(0, 0, 0, 0.54)"/>
                        </svg>
                    </a>
                    <a className="nav-item" onClick={this.setToolToDrawSketch}>
                        <svg className="sketch-icon" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="rgba(0, 0, 0, 0.54)"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </a>
                    <a className="nav-item" href="">
                        <svg className="sketch-icon" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="rgba(0, 0, 0, 0.54)"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </a>
                    <a className="nav-item" href="">
                        <svg className="sketch-icon" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="rgba(0, 0, 0, 0.54)"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </a>
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
        const sketchBoard = this.props.app.sketchBoard;
        if (sketchBoard.state.tool === tool) {
            return;
        }
        sketchBoard.setState({ tool });
    }
}

export default ToolPalate;