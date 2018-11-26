import * as React from 'react';
import { ISelectorProps } from 'src/datatypes/interfaces';
import toolCollection from '../data/ToolCollection';

class Selector extends React.Component<ISelectorProps, any> {

    public constructor(props: ISelectorProps) {
        super(props);
        this.bindHandlers();
    }

    public componentDidMount() {
        const tmp = document.getElementsByClassName('selector');
        const len = tmp.length;
        for (let i = 0; i < len; ++i) {
            tmp[i].addEventListener('mouseleave', () => {
                const tool = this.props.sketchBoard.state.tool
                if (tool.toolRepo === null || tool.mouseState.down === true) {
                    return;
                }
                this.props.sketchBoard.setState({ tool: tool.toolRepo });
                tool.toolRepo = null;
            }, false);
        }
    }

    public render() {
        const inline1 = {
            marginRight: (this.props.width / 2 - 8) + 'px',
        }
        const inline2 = {
            top: (this.props.height / 2 - 5 - 9) + 'px'
        }
        const inline3 = {
            top: (this.props.height / 2 - 5 - 2 * 9) + 'px'
        }
        const inline4 = {
            cursor: 'nesw-resize',
            top: (this.props.height - 23) + 'px',
        }
        const inline5 = {
            cursor: 'nwse-resize',
            top: (this.props.height - 32) + 'px',
        }
        const inline6 = {
            marginRight: (this.props.width / 2 - 8) + 'px',
            top: (this.props.height - 32) + 'px',
        }
        return (
            <div className="selectCage">
                <div id="selector-top-left" className="selector left" onMouseEnter={this.handleMouseEnterTopLeft} />
                <div id="selector-top-right" className="selector right" onMouseEnter={this.handleMouseEnterTopRight} />
                <div id="selector-top-middle" className="selector middel middel-horizontal" style={inline1} onMouseEnter={this.handleMouseEnterTopMiddle} />
                <div id="selector-middle-left" className="selector left middel-vertical" style={inline2} onMouseEnter={this.handleMouseEnterMiddleLeft} />
                <div id="selector-middle-right" className="selector right middel-vertical" style={inline3} onMouseEnter={this.handleMouseEnterMiddleRight} />
                <div id="selector-bottom-left" className="selector left" style={inline4} onMouseEnter={this.handleMouseEnterBottomLeft} />
                <div id="selector-bottom-right" className="selector right" style={inline5} onMouseEnter={this.handleMouseEnterBottomRight} />
                <div id="selector-bottom-middle" className="selector middel middel-horizontal" style={inline6} onMouseEnter={this.handleMouseEnterBottomMiddle} />
            </div>
        );
    }

    private handleMouseEnter(horizontalMode: number, verticalMode: number, selectorID: string) {
        if (this.props.sketchBoard.state.tool === toolCollection.Resize) {
            return;
        }
        toolCollection.Resize.toolRepo = this.props.sketchBoard.state.tool;
        toolCollection.Resize.horizontal = horizontalMode;
        toolCollection.Resize.vertical = verticalMode;
        toolCollection.Resize.selectorID = selectorID;
        this.props.sketchBoard.setState({
            tool: toolCollection.Resize,
        });
    }

    private handleMouseEnterTopLeft() {
        this.handleMouseEnter(1, 1, 'selector-top-left');
    }

    private handleMouseEnterTopRight() {
        this.handleMouseEnter(2, 1, 'selector-top-right');
    }

    private handleMouseEnterTopMiddle() {
        this.handleMouseEnter(0, 1, 'selector-top-middle');
    }

    private handleMouseEnterMiddleLeft() {
        this.handleMouseEnter(1, 0, 'selector-middle-left');
    }

    private handleMouseEnterMiddleRight() {
        this.handleMouseEnter(2, 0, 'selector-middle-right');
    }

    private handleMouseEnterBottomLeft() {
        this.handleMouseEnter(1, 2, 'selector-bottom-left');
    }

    private handleMouseEnterBottomRight() {
        this.handleMouseEnter(2, 2, 'selector-bottom-right');
    }

    private handleMouseEnterBottomMiddle() {
        this.handleMouseEnter(0, 2, 'selector-bottom-middle');
    }

    private bindHandlers() {
        this.handleMouseEnterTopLeft = this.handleMouseEnterTopLeft.bind(this);
        this.handleMouseEnterTopRight = this.handleMouseEnterTopRight.bind(this);
        this.handleMouseEnterTopMiddle = this.handleMouseEnterTopMiddle.bind(this);
        this.handleMouseEnterMiddleLeft = this.handleMouseEnterMiddleLeft.bind(this);
        this.handleMouseEnterMiddleRight = this.handleMouseEnterMiddleRight.bind(this);
        this.handleMouseEnterBottomLeft = this.handleMouseEnterBottomLeft.bind(this);
        this.handleMouseEnterBottomRight = this.handleMouseEnterBottomRight.bind(this);
        this.handleMouseEnterBottomMiddle = this.handleMouseEnterBottomMiddle.bind(this);
    }
}

export default Selector;