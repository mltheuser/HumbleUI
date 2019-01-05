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
    inEditMode: boolean,
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
    width: number,
    style: string,
}

export interface IBorderRadius {
    topLeft: number,
    topRight: number,
    bottomRight: number,
    bottomLeft: number,
}

export interface ISketchState extends IElementState {
    scroll: number,
    sketches: HumbleArray,
    color: string,
    border: IBorder,
    borderRadius: IBorderRadius,
}

export interface ISelectorProps {
    sketchBoard: SketchBoard;
}

export interface ICoordiante {
    x: number,
    y: number,
}

export interface IBorderRadiusSelector extends ISelectorProps{
    position: ICoordiante,
    selectorID: string,
}

export interface ICssPropertyValuePairs {
    'background-color'?: string;
    color?: string;
}