import * as React from 'react';
import { IAbsolutePositionedComponent } from 'src/components/AbsolutePositionedComponent';
import { Coordinate } from 'src/datatypes/Coordinate';
import BackgroundColor from 'src/datatypes/DisplayProperties/Properties/BackgroundColor';
import BorderColor from 'src/datatypes/DisplayProperties/Properties/Border/BorderColor';
import BorderStyle from 'src/datatypes/DisplayProperties/Properties/Border/BorderStyle';
import BorderWidth from 'src/datatypes/DisplayProperties/Properties/Border/BorderWidth';
import BorderBottomLeftRadius from 'src/datatypes/DisplayProperties/Properties/BorderRadius/BorderBottomLeftRadius';
import BorderBottomRightRadius from 'src/datatypes/DisplayProperties/Properties/BorderRadius/BorderBottomRightRadius';
import BorderTopLeftRadius from 'src/datatypes/DisplayProperties/Properties/BorderRadius/BorderTopLeftRadius';
import BorderTopRightRadius from 'src/datatypes/DisplayProperties/Properties/BorderRadius/BorderTopRightRadius';
import { BoardElement, IBoardElement, IBoardElementState, IBoardElementStyle } from "../BoardElement";

interface IRectangleStyle extends IBoardElementStyle {
    background: string,
    borderColor: string,
    borderStyle: string,
    borderWidth: number | string,
}

interface IRectangleUser extends IBoardElement {
    getRightBorder(): number,
    getBottomBorder(): number,
    getOffset(): Coordinate,
}

// make this correct
export function implementsIRectangleUser(object: IAbsolutePositionedComponent): object is IRectangleUser {
    return 'getRightBorder' in object;
}

export function usesBorderRadius(object: IRectangleUser) {
    const localDisplayProperties = object.state.displayProperties;
    return "border-top-left-radius" in localDisplayProperties
        && "border-top-right-radius" in localDisplayProperties
        && "border-bottom-left-radius" in localDisplayProperties
        && "border-bottom-right-radius" in localDisplayProperties;
}

interface IDecorateInitalStateParams {
    withBorderRadius?: boolean,
}

abstract class Rectangle {

    public static decorateInitialState(boardElement: BoardElement<IBoardElementState>, initalState: IBoardElementState, params: IDecorateInitalStateParams = {}) {
        // background-color
        const backgroundColor = new BackgroundColor(boardElement);
        backgroundColor.setValue('#fff');
        initalState.displayProperties.add(backgroundColor);
        // border-color
        const borderColor = new BorderColor(boardElement);
        borderColor.setValue('#d0d0d0');
        initalState.displayProperties.add(borderColor);
        // border-width
        const borderWidth = new BorderWidth(boardElement);
        borderWidth.setValue(8);
        initalState.displayProperties.add(borderWidth);
        // border-style
        const borderStyle = new BorderStyle(boardElement);
        borderStyle.setValue('solid'); // will be set to none if disabled
        initalState.displayProperties.add(borderStyle);

        if (params) {
            if (params.withBorderRadius) {
                // border-radius
                // border-top-left-radius
                const borderTopLeftRadius = new BorderTopLeftRadius(boardElement);
                borderTopLeftRadius.setValue(0);
                initalState.displayProperties.add(borderTopLeftRadius);
                // border-top-right-radius
                const borderTopRightRadius = new BorderTopRightRadius(boardElement);
                borderTopRightRadius.setValue(0);
                initalState.displayProperties.add(borderTopRightRadius);
                // border-bottom-left-radius
                const borderBottomLeftRadius = new BorderBottomLeftRadius(boardElement);
                borderBottomLeftRadius.setValue(0);
                initalState.displayProperties.add(borderBottomLeftRadius);
                // border-bottom-right-radius
                const borderBottomRightRadius = new BorderBottomRightRadius(boardElement);
                borderBottomRightRadius.setValue(0);
                initalState.displayProperties.add(borderBottomRightRadius);
            }
        }
    }

    public static getRightBorder(boardElement: IRectangleUser): number {
        const localDisplayProperties = boardElement.state.displayProperties;
        if (localDisplayProperties["border-style"].getValue() === "none") {
            return localDisplayProperties.left.getValue() + localDisplayProperties.width.getValue();
        }
        return localDisplayProperties.left.getValue() + localDisplayProperties.width.getValue() + 2 * localDisplayProperties["border-width"].getValue();
    }

    public static getBottomBorder(boardElement: IRectangleUser): number {
        const localDisplayProperties = boardElement.state.displayProperties;
        if (localDisplayProperties["border-style"].getValue() === "none") {
            return localDisplayProperties.top.getValue() + localDisplayProperties.height.getValue();
        }
        return localDisplayProperties.top.getValue() + localDisplayProperties.height.getValue() + 2 * localDisplayProperties["border-width"].getValue();
    }

    public static getOffset(boardElement: IRectangleUser): Coordinate {
        const localDisplayProperties = boardElement.state.displayProperties;
        return new Coordinate(
            localDisplayProperties.left.getValue() + localDisplayProperties["border-width"].getValue(),
            localDisplayProperties.top.getValue() + localDisplayProperties["border-width"].getValue(),
        )
    }

    public static getInlineStyle(boardElement: IRectangleUser): IRectangleStyle {
        const localState = boardElement.state;
        const localDisplayProperties = localState.displayProperties;
        const inline = {
            background: '',
            borderColor: localDisplayProperties["border-color"].getValue(),
            borderStyle: localDisplayProperties["border-style"].getValue(),
            borderWidth: localDisplayProperties["border-width"].getValue(),
            height: localDisplayProperties.height.getValue() - 2 * localDisplayProperties["border-width"].getValue(),
            left: localDisplayProperties.left.getValue(),
            top: localDisplayProperties.top.getValue(),
            width: localDisplayProperties.width.getValue() - 2 * localDisplayProperties["border-width"].getValue(),
        }
        if (localState.refined === true) {
            inline.background = localDisplayProperties["background-color"].getValue();
        }
        if (localDisplayProperties.borderIsChecked() === false) {
            inline.top += inline.borderWidth;
            inline.left += inline.borderWidth;
        }
        return inline;
    }

    public static render(boardElement: IRectangleUser) {
        const id = boardElement.getId();
        return (
            <div className={boardElement.constructor.name} style={boardElement.getInlineStyle()} id={id} />
        );
    }

}

export {
    IRectangleStyle,
    IRectangleUser,
    Rectangle,
};