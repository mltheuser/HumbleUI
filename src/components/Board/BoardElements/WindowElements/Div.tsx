import { ReactNode } from 'react';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import HumbleArray from 'src/datatypes/HumbleArray';
import { IBoardElementState } from '../../BoardElement';
import { IRectangleStyle, IRectangleUser, Rectangle } from '../Rectangle';
import { WindowElement } from '../WindowElement';
import { IWindowElementContainerUser, IWindowElementContainerUserState, WindowElementContainer } from '../WindowElementContainer';

interface IDivState extends IBoardElementState, IWindowElementContainerUserState {

}

interface IDivStyle extends IRectangleStyle {
    borderRadius: string,
}

class Div<S extends IDivState> extends WindowElement<S> implements IWindowElementContainerUser, IRectangleUser {

    constructor(id: string, boardElements: HumbleArray = new HumbleArray()) {
        super(id, boardElements);
    }

    public getRightBorder(): number {
        return Rectangle.getRightBorder(this);
    }

    public getBottomBorder(): number {
        return Rectangle.getBottomBorder(this);
    }

    public getOffset(): Coordinate {
        return Rectangle.getOffset(this);
    }

    public updateInits(mode: number): void { // mode is bad style
        WindowElementContainer.updateInits(this, mode);
    }

    public resizeChildren() {
        WindowElementContainer.resizeChildren(this);
    }

    public getInlineStyle(): IDivStyle {
        const inline = Rectangle.getInlineStyle(this) as IDivStyle;
        inline.borderRadius = (this.state.displayProperties["border-top-left-radius"].getValue() + 'px ') + (this.state.displayProperties["border-top-right-radius"].getValue() + 'px ')
            + (this.state.displayProperties["border-bottom-left-radius"].getValue() + 'px ') + (this.state.displayProperties["border-bottom-right-radius"].getValue() + 'px');
        return inline;
    }

    public render(): ReactNode {
        return WindowElementContainer.render(this);
    }

    public toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration, level: number): string {
        const boardElements = this.state.boardElements;
        const childCount = boardElements.data.length;
        const tabLevel = super.getTabLevel(level);
        if (childCount === 0) {
            return tabLevel + '<div ' + super.renderSelectors(localStyleDecleration, globalStyleDecleration) + ' />\n';
        } else {
            let result = tabLevel + '<div ' + super.renderSelectors(localStyleDecleration, globalStyleDecleration) + ' >\n';
            for (const child of boardElements.data) {
                result += child.toString(localStyleDecleration, globalStyleDecleration, level + 1);
            }
            result += tabLevel + '</div>\n';
            return result;
        }
    }

    protected getInitialState(boardElements: HumbleArray): S {
        const state = super.getInitialState();
        state.boardElements = boardElements;
        return state as S;
    }

}

export {
    IDivState,
    Div,
}