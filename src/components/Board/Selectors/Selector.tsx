import * as React from 'react';
import { Coordinate } from 'src/datatypes/Coordinate';
import toolCollection from '../../../data/ToolCollection';
import BorderRadiusSelect from '../../BorderRadiusSelect';
import { BoardElement, IBoardElementState } from '../BoardElement';
import { SketchBoard } from '../SketchBoard';

interface ISelectedBoardElement {
    selectedBoardElement: BoardElement<IBoardElementState>
}

class Selector extends React.Component<any, any> {

    public constructor(props = {}) {
        super(props);
        this.bindHandlers();
    }

    public render() {
        const selectedBoardElement = this.getSelectedBoardElement();
        if (selectedBoardElement === null) {
            return null;
        }

        // calculate the selctors offset
        const selectedBoardElementOffSet = SketchBoard.calculateOffSetById(selectedBoardElement.getId());
        const sketchBoardElementOffSet = SketchBoard.calculateOffSetById("0");
        const selctorOffSet = Coordinate.sub(selectedBoardElementOffSet, sketchBoardElementOffSet);

        const selectorCageBorderWidth = 1.7;

        const inline = {
            background: '',
            borderColor: this.getBorderColor(),
            borderStyle: 'solid',
            borderWidth: selectorCageBorderWidth,
            height: selectedBoardElement.state.displayProperties.height.getValue() - selectorCageBorderWidth,
            left: selectedBoardElement.state.displayProperties.left.getValue() + selctorOffSet.x,
            top: selectedBoardElement.state.displayProperties.top.getValue() + selctorOffSet.y,
            width: selectedBoardElement.state.displayProperties.width.getValue() - selectorCageBorderWidth,
        }
        if (selectedBoardElement.state.displayProperties.borderIsChecked() === false) {
            inline.top += selectedBoardElement.state.displayProperties["border-width"].getValue();
            inline.left += selectedBoardElement.state.displayProperties["border-width"].getValue();
            inline.height -= 2 * selectedBoardElement.state.displayProperties["border-width"].getValue();
            inline.width -= 2 * selectedBoardElement.state.displayProperties["border-width"].getValue();
        }
        const cageStyle = {
            display: 'block',
        }
        const rulerStyle = {
            backgroundColor: this.getRulerBackgroundColor(),
            display: 'block',
        }
        if (selectedBoardElement.state.refined === false) {
            inline.borderStyle = 'hidden';
            rulerStyle.backgroundColor = 'rgba(0, 0, 0, 0.54)';
            return (
                <div className="select-area" style={inline}>
                    <div className="ruler" style={rulerStyle}>{Math.round(selectedBoardElement.getActuallWidth())}x{Math.round(selectedBoardElement.getActuallHeight())}</div>
                    < BorderRadiusSelect selectedBoardElement={selectedBoardElement} />
                </div>
            )
        } else {
            const inlineTopLeft = {
                borderColor: this.getSelectorColor(),
            }
            const inlineTopRight = {
                borderColor: this.getSelectorColor(),
            }
            const inlineTopMiddle = {
                borderColor: this.getSelectorColor(),
                marginRight: (inline.width / 2 - 8) + 'px',
            }
            const inlineMiddleLeft = {
                borderColor: this.getSelectorColor(),
                top: (inline.height / 2 - 5 - 9) + 'px'
            }
            const inlineMiddleRight = {
                borderColor: this.getSelectorColor(),
                top: (inline.height / 2 - 5 - 2 * 9) + 'px'
            }
            const inlineBottomLeft = {
                borderColor: this.getSelectorColor(),
                cursor: 'nesw-resize',
                top: (inline.height - 21) + 'px',
            }
            const inlineBottomRight = {
                borderColor: this.getSelectorColor(),
                cursor: 'nwse-resize',
                top: (inline.height - 30) + 'px',
            }
            const inlineBottomMiddle = {
                borderColor: this.getSelectorColor(),
                marginRight: (inline.width / 2 - 8) + 'px',
                top: (inline.height - 30) + 'px',
            }
            return (
                <div className="select-area" style={inline}>
                    <div className="ruler" style={rulerStyle}>{Math.round(selectedBoardElement.getActuallWidth())}x{Math.round(selectedBoardElement.getActuallHeight())}</div>
                    <div className="selectCage" style={cageStyle}>
                        <div id="selector-top-left" className="selector left" style={inlineTopLeft} onMouseEnter={this.handleMouseEnterTopLeft} onMouseLeave={this.handleMouseLeave} />
                        <div id="selector-top-right" className="selector right" style={inlineTopRight} onMouseEnter={this.handleMouseEnterTopRight} onMouseLeave={this.handleMouseLeave} />
                        <div id="selector-top-middle" className="selector middel middel-horizontal" style={inlineTopMiddle} onMouseEnter={this.handleMouseEnterTopMiddle} onMouseLeave={this.handleMouseLeave} />
                        <div id="selector-middle-left" className="selector left middel-vertical" style={inlineMiddleLeft} onMouseEnter={this.handleMouseEnterMiddleLeft} onMouseLeave={this.handleMouseLeave} />
                        <div id="selector-middle-right" className="selector right middel-vertical" style={inlineMiddleRight} onMouseEnter={this.handleMouseEnterMiddleRight} onMouseLeave={this.handleMouseLeave} />
                        <div id="selector-bottom-left" className="selector left" style={inlineBottomLeft} onMouseEnter={this.handleMouseEnterBottomLeft} onMouseLeave={this.handleMouseLeave} />
                        <div id="selector-bottom-right" className="selector right" style={inlineBottomRight} onMouseEnter={this.handleMouseEnterBottomRight} onMouseLeave={this.handleMouseLeave} />
                        <div id="selector-bottom-middle" className="selector middel middel-horizontal" style={inlineBottomMiddle} onMouseEnter={this.handleMouseEnterBottomMiddle} onMouseLeave={this.handleMouseLeave} />
                    </div>
                    < BorderRadiusSelect selectedBoardElement={selectedBoardElement} />
                </div>
            );
        }
    }

    protected getSelectedBoardElement(): BoardElement<IBoardElementState> | null {
        return SketchBoard.getInstance().state.selectedBoardElement;
    }

    protected getBorderColor(): string {
        return '#427fd3';
    }

    protected getRulerBackgroundColor(): string {
        return 'rgba(66, 127, 211, 0.54)';
    }

    protected getSelectorColor(): string {
        return '#427fd3';
    }

    private handleMouseEnter(horizontalMode: number, verticalMode: number, selectorID: string) {
        const sketchBoard = SketchBoard.getInstance();
        if (sketchBoard.state.tool === toolCollection.Resize) {
            return;
        }
        toolCollection.Resize.toolRepo = sketchBoard.state.tool;
        toolCollection.Resize.horizontal = horizontalMode;
        toolCollection.Resize.vertical = verticalMode;
        toolCollection.Resize.selectorID = selectorID;
        toolCollection.Resize.mouseState.target = this.getSelectedBoardElement();
        sketchBoard.setState({
            tool: toolCollection.Resize,
        });
    }

    private handleMouseLeave() {
        const sketchBoard = SketchBoard.getInstance();
        const tool = sketchBoard.state.tool;
        if (tool !== toolCollection.Resize) {
            throw new EvalError(`
            While the mouse is over a selector, the tool should not change. 
            Therefore, when exiting, the Resize tool is still expected to be selected.
            `);
        }
        if (tool.toolRepo === null || tool.mouseState.down === true) {
            return;
        }
        toolCollection.Resize.mouseState.target = null;
        sketchBoard.setState({ tool: tool.toolRepo });
        tool.toolRepo = null;
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
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
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

export {
    ISelectedBoardElement,
    Selector,
};