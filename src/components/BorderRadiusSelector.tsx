import * as React from 'react';
import toolCollection from 'src/data/ToolCollection';
import { Coordinate } from 'src/datatypes/Coordinate';
import { IBorderRadiusSelector } from 'src/datatypes/interfaces';
import { SketchBoard } from './Board/SketchBoard';

class BorderRadiusSelector extends React.Component<IBorderRadiusSelector, any> {

    constructor(props: IBorderRadiusSelector) {
        super(props);
        this.bindHandlers();
    }

    public render() {
        const position = this.centerDivAtPosition(this.props.position);
        const localStyle = {
            display: 'block',
            left: position.x + 'px',
            top: position.y + 'px',
        }
        const selectedBoardElement = SketchBoard.getInstance().state.selectedBoardElement;
        if (selectedBoardElement === null) {
            return;
        }
        if (selectedBoardElement.state.refined === false) {
            const tool = this.props.sketchBoard.state.tool;
            if (!(tool === toolCollection.SelectBorderRadius && tool.mouseState.down && tool.selectorID === this.props.selectorID)) {
                localStyle.display = 'none';
            }
        }
        return (
            <div id={this.props.selectorID} className="radiusSelector" style={localStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <svg width="9" height="9" viewBox="0 0 11 11">
                    <g transform="translate(-144 -406)">
                        <g transform="translate(144 406)" fill="#fff" stroke="#427fd3" strokeWidth="1">
                            <circle cx="5.5" cy="5.5" r="5.5" stroke="none" />
                            <circle cx="5.5" cy="5.5" r="5" fill="none" />
                        </g>
                        <circle cx="2.5" cy="2.5" r="2.5" transform="translate(147 409)" fill="#427fd3" />
                    </g>
                </svg>
            </div>
        );
    }

    private centerDivAtPosition(position: Coordinate): Coordinate {
        position.x -= 4.5;
        position.y -= 10;
        return position;
    }

    private handleMouseEnter() {
        if (this.props.sketchBoard.state.tool === toolCollection.SelectBorderRadius) {
            return;
        }
        toolCollection.SelectBorderRadius.toolRepo = this.props.sketchBoard.state.tool;
        toolCollection.SelectBorderRadius.selectorID = this.props.selectorID;
        this.props.sketchBoard.setState({
            tool: toolCollection.SelectBorderRadius,
        });
    }

    private handleMouseLeave() {
        const tool = this.props.sketchBoard.state.tool;
        if (tool.toolRepo === null || tool.mouseState.down === true) {
            return;
        }
        this.props.sketchBoard.setState({ tool: tool.toolRepo });
        tool.toolRepo = null;
    }

    private bindHandlers() {
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }
}

export default BorderRadiusSelector;