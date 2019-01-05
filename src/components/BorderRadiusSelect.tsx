import * as React from 'react';
import { IElementState, ISelectorProps } from "src/datatypes/interfaces";
import BorderRadiusSelector from './BorderRadiusSelector';
import Element from './Element';
import Sketch from './Sketch';

class BorderRadiusSelect extends React.Component<ISelectorProps, any> {

    public constructor(props: ISelectorProps) {
        super(props);
    }

    public render() {
        const selected: Element<IElementState> | null = this.props.sketchBoard.state.selected;
        if (selected === null || !(selected instanceof Sketch)) {
            return null;
        }
        // default case
        const borderRadius = selected.state.borderRadius;

        const topLeft = borderRadius.topLeft < 20 ?
            {
                x: 20,
                y: 20,
            }
            :
            {
                x: borderRadius.topLeft,
                y: borderRadius.topLeft,
            }

        const topRight = borderRadius.topRight < 20 ?
            {
                x: selected.getRightBorder() - selected.getLeftBorder() - 20,
                y: 20,
            }
            :
            {
                x: selected.getRightBorder() - selected.getLeftBorder() - borderRadius.topRight,
                y: borderRadius.topRight,
            }
        const bottomLeft = borderRadius.bottomLeft < 20 ?
            {
                x: 20,
                y: selected.getBottomBorder() - selected.getTopBorder() - 20,
            }
            :
            {
                x: borderRadius.bottomLeft,
                y: selected.getBottomBorder() - selected.getTopBorder() - borderRadius.bottomLeft,
            }
        const bottomRight = borderRadius.bottomRight < 20 ?
            {
                x: selected.getRightBorder() - selected.getLeftBorder() - 20,
                y: selected.getBottomBorder() - selected.getTopBorder() - 20,
            }
            :
            {
                x: selected.getRightBorder() - selected.getLeftBorder() - borderRadius.bottomRight,
                y: selected.getBottomBorder() - selected.getTopBorder() - borderRadius.bottomRight,
            }
        return (
            <div className="BorderRadiusSelect">
                <BorderRadiusSelector
                    position={topLeft}
                    sketchBoard={this.props.sketchBoard}
                    selectorID={'BorderRadiusSelectorTopLeft'}
                />
                <BorderRadiusSelector
                    position={topRight}
                    sketchBoard={this.props.sketchBoard}
                    selectorID={'BorderRadiusSelectorTopRight'}
                />
                <BorderRadiusSelector
                    position={bottomLeft}
                    sketchBoard={this.props.sketchBoard}
                    selectorID={'BorderRadiusSelectorBottomLeft'}
                />
                <BorderRadiusSelector
                    position={bottomRight}
                    sketchBoard={this.props.sketchBoard}
                    selectorID={'BorderRadiusSelectorBottomRight'}
                />
            </div>
        )
    }
}

export default BorderRadiusSelect;