import { ISketchBoardState, SketchBoard } from 'src/components/Board/SketchBoard';
import { ICoordinate } from './Coordinate';

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
    position: ICoordinate,
    selectorID: string,
}

export interface ICssPropertyValuePairs {
    'background-color'?: string;
    color?: string;
}