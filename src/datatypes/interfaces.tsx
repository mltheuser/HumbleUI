import App from "src/App";
import Element from 'src/components/Element';
import SketchBoard from 'src/components/SketchBoard';
import Tool from 'src/components/Tool';
import HumbleArray from './HumbleArray';

export interface IAppProps {
    app: App,
}

export interface IElementState {
    height: number,
    left: number,
    refined: boolean,
    selected: boolean,
    top: number,
    width: number,
}

export interface ISketchBoardState {
    left: number,
    selected: Element<IElementState> | null,
    sketches: HumbleArray,
    tool: Tool,
    top: number,
    zoom: number,
}

export interface IBorder {
    checked: boolean,
    color: string,
    width: string,
    style: string,
}

export interface ISketchState extends IElementState {
    scroll: number,
    sketches: HumbleArray,
    color: string,
    border: IBorder,
}

export interface ISelectorProps {
    sketchBoard: SketchBoard;
    width: number;
    height: number;
}