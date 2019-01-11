import App from "src/App";
import Element from 'src/components/Board/Element';
import SketchBoard from 'src/components/Board/SketchBoard';
import Tool from 'src/components/Tool';
import DisplayPropertyCollection from './DisplayProperties/DisplayPropertyCollection';
import HumbleArray from './HumbleArray';

export interface IAppProps {
    app: App,
}

export interface IElementState {
    displayProperties: DisplayPropertyCollection,
    inEditMode: boolean,
    refined: boolean,
    selected: boolean,
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

export interface IElementContainerState extends IElementState {
    borderChecked: boolean,
    sketches: HumbleArray,
}

export interface IElementContainerStyle {
    background: string,
    borderColor: string,
    borderStyle: string,
    borderWidth: number | string,
    height: number | string,
    left: number | string,
    top: number | string,
    width: number | string,
}

export interface IWindowSketchState extends IElementContainerState {
    scroll: number,
}

export interface ISketchInlineStyle extends IElementContainerStyle {
    borderRadius?: string,
}

export interface ISelectorProps {
    sketchBoard: SketchBoard,
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