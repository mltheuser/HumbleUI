import * as React from 'react';
import App from 'src/App';
import { Coordinate, ICoordinate } from 'src/datatypes/Coordinate';
import DisplayPropertyCollection from 'src/datatypes/DisplayProperties/DisplayPropertyCollection';
import Left from 'src/datatypes/DisplayProperties/Properties/Left';
import Top from 'src/datatypes/DisplayProperties/Properties/Top';
import HumbleArray from 'src/datatypes/HumbleArray';
import toolCollection from '../../data/ToolCollection';
import { AbsolutePositionedComponent, IAbsolutePositionedComponentState } from '../AbsolutePositionedComponent';
import Selector from '../Selector';
import Tool from '../Tool';
import { BoardElement, IBoardElementState } from './BoardElement';
import { Window } from './BoardElements/Window';
import { IWindowElementContainerUserState, StateInstanceOfIWindowElementContainerUserState } from './BoardElements/WindowElementContainer';

interface ISketchBoardState extends IAbsolutePositionedComponentState, IWindowElementContainerUserState {
    selectedBoardElement: BoardElement<IBoardElementState> | null,
    tool: Tool,
    zoom: number,
}

class SketchBoard<S extends ISketchBoardState> extends AbsolutePositionedComponent<S> {

    public static getInstance(): SketchBoard<ISketchBoardState> {
        return this.instance;
    }

    public static calculateOffSetById(id: string, searchSpace: AbsolutePositionedComponent<IWindowElementContainerUserState> = SketchBoard.getInstance(), sum: ICoordinate = { x: 0, y: 0 }): Coordinate {
        if (id.length === 0) {
            throw EvalError("An empty string is no valid id.");
        }
        const searchSpaceOffSet = searchSpace.getOffset();
        if (id.length === 1) {
            return Coordinate.add(sum, searchSpaceOffSet);
        } else {
            return SketchBoard.calculateOffSetById(
                id.substring(1),
                searchSpace.state.boardElements.data[id.charAt(0)],
                Coordinate.add(sum, searchSpaceOffSet)
            );
        }
    }

    private static instance: SketchBoard<ISketchBoardState>;

    public state: S;

    public constructor() {
        super();
        toolCollection.bind(this);
        if (SketchBoard.instance) {
            throw EvalError("Sketchboard is a Singelton and there for can not have more than one instance.");
        } else {
            SketchBoard.instance = this;
        }
    }

    public updateInits(mode = 2) {
        const boardElements = this.state.boardElements;
        for (let i = 0, len = boardElements.data.length; i < len; ++i) {
            boardElements.data[i].updateInits(mode);
        }
    }

    public findElementById(searchSpace: AbsolutePositionedComponent<IWindowElementContainerUserState> = this, id: string = ''): BoardElement<IBoardElementState> {
        const localBoardElements = searchSpace.state.boardElements;
        if (id.length === 1) {
            return localBoardElements.data[id];
        }
        return this.findElementById(localBoardElements.data[id.charAt(0)], id.substring(1));
    }

    // refactor this mess
    public findAndSelectElementByTargetId(id: string): BoardElement<IBoardElementState> {
        let i = 0;
        if (this.state.selectedBoardElement) {
            const len = id.length;
            const len2 = (this.state.selectedBoardElement === null ? 0 : this.state.selectedBoardElement.getId().length);
            for (; i < len; ++i) {
                if (i === len2 || id.charAt(i) !== this.state.selectedBoardElement.getId().charAt(i)) {
                    break;
                }
            }
        }
        const element = this.findElementById(this, id.substring(0, i + 1));
        element.state.isSelected = true;
        return element;
    }

    public updateSelection(boardElement: BoardElement<IBoardElementState>) {
        if (boardElement !== null) {
            boardElement = this.findAndSelectElementByTargetId(boardElement.getId());
        }
        if (boardElement === this.state.selectedBoardElement) {
            return;
        }
        this.setState((prevState: any) => {
            if (prevState.selectedBoardElement !== null) {
                prevState.selectedBoardElement.state.isSelected = false;
            }
            return {
                selectedBoardElement: boardElement,
            } as ISketchBoardState
        });
        App.getInstance().setState({});
    }

    public componentDidMount() {
        window.addEventListener('wheel', this.handleScroll.bind(this), { passive: true } as EventListenerOptions);
    }

    public componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll.bind(this), { passive: true } as EventListenerOptions);
    }

    public handleScroll(event: any) {
        if (event.shiftKey) {
            const scrollTargetId = event.target.id[0];
            if (scrollTargetId !== undefined) {
                const scrollTarget = this.findElementById(this, scrollTargetId);
                if (scrollTarget instanceof Window) {
                    scrollTarget.handleScroll(event);
                    this.setState({});
                }
            }
        } else {
            this.handleSketchBoardScroll(event);
        }
    }

    public render() {
        const inline = {
            cursor: this.state.tool.cursor
        }
        return (
            <main id="main" style={inline} onMouseDown={this.state.tool.handleMouseDown} onMouseMove={this.state.tool.handleMouseMove} onMouseUp={this.state.tool.handleMouseUp}>
                {this.state.boardElements.render()}
                <Selector sketchBoard={this} />
            </main>
        );
    }

    public getCenter(): Coordinate {
        const main = document.getElementById('main');
        const toolpalate = document.getElementById('tool-palate');
        const info = document.getElementById('info');
        if (toolpalate && toolpalate.offsetWidth && main && info) {
            return new Coordinate(
                toolpalate.offsetWidth + (main.offsetWidth - info.offsetWidth - toolpalate.offsetWidth) / 2,
                main.offsetHeight / 2,
            );
        }
        throw Error("getCenter failed.");
    }

    protected getInitialState(id: string = '', boardElements: HumbleArray = new HumbleArray()): S {
        // fill a displayPropertyCollection with inital values
        const displayProperties = new DisplayPropertyCollection();
        // top
        const top = new Top(this);
        top.setValue(64);
        displayProperties.add(top);
        // left
        const left = new Left(this);
        left.setValue(0);
        displayProperties.add(left);
        return {
            boardElements,
            displayProperties,
            selectedBoardElement: null,
            tool: toolCollection.Default,
            zoom: 1,
        } as S;
    }

    protected getInitalName() {
        return 'sketchBoard';
    }

    private zoomDomainElements(domain: AbsolutePositionedComponent<IWindowElementContainerUserState>, newZoom: number, repositionVector = { x: 0, y: 0 }) {
        for (const boardElement of domain.state.boardElements) {
            const localDisplayProperties = boardElement.state.displayProperties;
            localDisplayProperties.top.setValue((localDisplayProperties.top.getValue() / this.state.zoom) * newZoom + repositionVector.y)
            localDisplayProperties.left.setValue((localDisplayProperties.left.getValue() / this.state.zoom) * newZoom + repositionVector.x);
            localDisplayProperties.height.setValue((localDisplayProperties.height.getValue() / this.state.zoom) * newZoom);
            localDisplayProperties.width.setValue((localDisplayProperties.width.getValue() / this.state.zoom) * newZoom);
            if (boardElement instanceof AbsolutePositionedComponent && StateInstanceOfIWindowElementContainerUserState(boardElement)) {
                this.zoomDomainElements(boardElement as AbsolutePositionedComponent<IWindowElementContainerUserState>, newZoom);
            }
        }
    }

    private handleSketchBoardScroll(event: any) {
        const center = this.getCenter();
        const newZoom = this.state.zoom + event.deltaY / 1600;
        const newCursor = {
            x: event.clientX / this.state.zoom * newZoom,
            y: (event.clientY - this.state.displayProperties.top.getValue()) / this.state.zoom * newZoom,
        };
        const dist = {
            x: center.x - newCursor.x,
            y: center.y - newCursor.y,
        };
        this.zoomDomainElements(this, newZoom, dist);
        this.setState({ zoom: newZoom });
    }
}

export {
    ISketchBoardState,
    SketchBoard,
}