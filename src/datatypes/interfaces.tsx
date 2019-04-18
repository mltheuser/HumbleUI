import { ICoordinate } from './Coordinate';

export interface IBorder {
    checked: boolean,
    color: string,
    width: number,
    style: string,
}

export interface IBorderRadiusSelector {
    position: ICoordinate,
    selectorID: string,
}

export interface ICssPropertyValuePairs {
    'background-color'?: string;
    color?: string;
}