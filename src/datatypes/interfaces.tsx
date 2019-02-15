import { ISketchBoardState, SketchBoard } from 'src/components/Board/SketchBoard';

export interface IBorder {
    checked: boolean,
    color: string,
    width: number,
    style: string,
}

export interface ISelectorProps {
    sketchBoard: SketchBoard<ISketchBoardState>,
}

export interface IBorderRadiusSelector extends ISelectorProps{
    position: ICoordiante,
    selectorID: string,
}

export interface ICssPropertyValuePairs {
    'background-color'?: string;
    color?: string;
}