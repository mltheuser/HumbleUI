import * as React from 'react';
import toolCollection from 'src/data/ToolCollection';
import { ICoordinate } from 'src/datatypes/Coordinate';
import { BoardElement, IBoardElementState } from './Board/BoardElement';
import { Div } from './Board/BoardElements/WindowElements/Div';
import { ISelectedBoardElement } from './Board/Selectors/Selector';
import { SketchBoard } from './Board/SketchBoard';
import BorderRadiusSelector from './BorderRadiusSelector';

class BorderRadiusSelect extends React.Component<ISelectedBoardElement, any> {

    protected static directionDict = {
        bottomLeft: { x: 1, y: -1 },
        bottomRight: { x: -1, y: -1 },
        topLeft: { x: 1, y: 1 },
        topRight: { x: -1, y: 1 },
    }

    public render() {
        const selectedBoardElement = this.props.selectedBoardElement;
        if (selectedBoardElement === null || !(selectedBoardElement instanceof Div) || selectedBoardElement instanceof Window) {
            return null;
        }
        // default case
        const displayProperties = selectedBoardElement.state.displayProperties;
        const maxRadius = this.getMaxRadius(selectedBoardElement);
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
                x: selectedBoardElement.getRightBorder() - selectedBoardElement.getLeftBorder() - 2 * displayProperties["border-width"].getValue(),
                y: 0,
            },
            maxRadius,
            'topRight',
            displayProperties["border-top-right-radius"].getValue()
        );
        const bottomLeft = this.passBorderRadiusByKey(
            {
                x: 0,
                y: selectedBoardElement.getBottomBorder() - selectedBoardElement.getTopBorder() - 2 * displayProperties["border-width"].getValue(),
            },
            maxRadius,
            'bottomLeft',
            displayProperties["border-bottom-left-radius"].getValue()
        );
        const bottomRight = this.passBorderRadiusByKey(
            {
                x: selectedBoardElement.getRightBorder() - selectedBoardElement.getLeftBorder() - 2 * displayProperties["border-width"].getValue(),
                y: selectedBoardElement.getBottomBorder() - selectedBoardElement.getTopBorder() - 2 * displayProperties["border-width"].getValue(),
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
                    selectorID={'topLeftRadius'}
                />
                <BorderRadiusSelector
                    position={topRight}
                    selectorID={'topRightRadius'}
                />
                <BorderRadiusSelector
                    position={bottomLeft}
                    selectorID={'bottomLeftRadius'}
                />
                <BorderRadiusSelector
                    position={bottomRight}
                    selectorID={'bottomRightRadius'}
                />
            </div>
        )
    }

    private getMaxRadius(selected: BoardElement<IBoardElementState>): number {
        const center = selected.getCenter();
        return Math.min(center.x - selected.getLeftBorder(), center.y - selected.getTopBorder());
    }

    private passBorderRadiusByKey(position: ICoordinate, maxRadius: number, key: string, borderRadius: number) {
        const directions = BorderRadiusSelect.directionDict[key];
        if (borderRadius > maxRadius) {
            borderRadius = maxRadius;
        }
        if (borderRadius < 20) {
            const tool = SketchBoard.getInstance().state.tool;
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