import * as React from 'react';
import toolCollection from 'src/data/ToolCollection';
import { ICoordiante, IElementState, ISelectorProps} from "src/datatypes/interfaces";
import Element from './Board/Element';
import Sketch from './Board/Elements/Sketch';
import WindowSketch from './Board/Elements/WindowSketch';
import BorderRadiusSelector from './BorderRadiusSelector';

class BorderRadiusSelect extends React.Component<ISelectorProps, any> {

    protected static directionTable = {
        bottomLeft: {x: 1, y: -1},
        bottomRight: {x: -1, y: -1},
        topLeft: {x: 1, y: 1},
        topRight: {x: -1, y: 1},
    }

    public constructor(props: ISelectorProps) {
        super(props);
    }

    public render() {
        const selected: Element<IElementState> | null = this.props.sketchBoard.state.selected;
        if (selected === null || !(selected instanceof Sketch) || selected instanceof WindowSketch) {
            return null;
        }
        // default case
        const displayProperties = selected.state.displayProperties;
        const maxRadius = this.getMaxRadius(selected);
        const topLeft = this.passBorderRadiusByKey(
            {
            x: 0,
            y: 0,
            },
            maxRadius,
            'topLeft',
            displayProperties["border-top-left-radius"].getValue()
        );
        const topRight = this.passBorderRadiusByKey(
            {
            x: selected.getRightBorder() - selected.getLeftBorder(),
            y: 0,
            },
            maxRadius,
            'topRight',
            displayProperties["border-top-right-radius"].getValue()
        );
        const bottomLeft = this.passBorderRadiusByKey(
            {
            x: 0,
            y: selected.getBottomBorder() - selected.getTopBorder(),
            },
            maxRadius,
            'bottomLeft',
            displayProperties["border-bottom-left-radius"].getValue()
        );
        const bottomRight = this.passBorderRadiusByKey(
            {
            x: selected.getRightBorder() - selected.getLeftBorder(),
            y: selected.getBottomBorder() - selected.getTopBorder(),
            },
            maxRadius,
            'bottomRight',
            displayProperties["border-bottom-right-radius"].getValue()
        );
        // combine overlapping selectors

        return (
            <div className="BorderRadiusSelect">
                <BorderRadiusSelector
                    position={topLeft}
                    sketchBoard={this.props.sketchBoard}
                    selectorID={'topLeftRadius'}
                />
                <BorderRadiusSelector
                    position={topRight}
                    sketchBoard={this.props.sketchBoard}
                    selectorID={'topRightRadius'}
                />
                <BorderRadiusSelector
                    position={bottomLeft}
                    sketchBoard={this.props.sketchBoard}
                    selectorID={'bottomLeftRadius'}
                />
                <BorderRadiusSelector
                    position={bottomRight}
                    sketchBoard={this.props.sketchBoard}
                    selectorID={'bottomRightRadius'}
                />
            </div>
        )
    }

    private getMaxRadius(selected: Element<IElementState>): number {
        const center = selected.getCenter();
        return Math.min(center.x - selected.getLeftBorder(), center.y - selected.getTopBorder());
    }

    private passBorderRadiusByKey(position: ICoordiante, maxRadius: number, key: string, borderRadius: number) {
        const directions = BorderRadiusSelect.directionTable[key];
        if (borderRadius > maxRadius) {
            borderRadius = maxRadius;
        }
        if (borderRadius < 20) {
            const tool = this.props.sketchBoard.state.tool;
            if (borderRadius < 0) {
                borderRadius = 0;
            }
            if (tool !== toolCollection.SelectBorderRadius || tool.mouseState.down === false || tool.selectorID !== key + "Radius") {
                position.x += directions.x * 20;
                position.y += directions.y * 20;
                return position;
            }
        }
        position.x += directions.x * borderRadius;
        position.y += directions.y * borderRadius;
        return position;
    }
}

export default BorderRadiusSelect;