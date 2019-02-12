import * as React from 'react';
import BackgroundColor from 'src/datatypes/DisplayProperties/Properties/BackgroundColor';
import BorderColor from 'src/datatypes/DisplayProperties/Properties/Border/BorderColor';
import BorderStyle from 'src/datatypes/DisplayProperties/Properties/Border/BorderStyle';
import BorderWidth from 'src/datatypes/DisplayProperties/Properties/Border/BorderWidth';
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

abstract class Rectangle {

    public static decorateInitialState(boardElement: BoardElement<IBoardElementState>, initalState: IBoardElementState) {
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
        borderWidth.setValue(1);
        initalState.displayProperties.add(borderWidth);
        // border-style
        const borderStyle = new BorderStyle(boardElement);
        borderStyle.setValue('solid'); // will be set to none if disabled
        initalState.displayProperties.add(borderStyle);
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
            height: localDisplayProperties.height.getValue(),
            left: localDisplayProperties.left.getValue(),
            top: localDisplayProperties.top.getValue(),
            width: localDisplayProperties.width.getValue(),
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