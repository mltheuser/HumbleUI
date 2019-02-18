import { ReactNode } from 'react';
import { Coordinate } from 'src/datatypes/Coordinate';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import HumbleArray from 'src/datatypes/HumbleArray';
import { BoardElement } from '../BoardElement';
import { SketchBoard } from '../SketchBoard';
import { IRectangleStyle, IRectangleUser, Rectangle } from './Rectangle';
import { IWindowElementContainerUser, IWindowElementContainerUserState, WindowElementContainer } from './WindowElementContainer';

interface IWindowState extends IWindowElementContainerUserState {
    scroll: number,
}

class Window<S extends IWindowState> extends BoardElement<S> implements IWindowElementContainerUser, IRectangleUser {

    constructor(id: string, windowElements: HumbleArray = new HumbleArray()) {
        super(id, windowElements);
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
        WindowElementContainer.updateInits(this, super.updateInits, mode);
    }

    public canItersectByHeightWith(window: Window<IWindowState>) {
        return ((this.state.displayProperties.top.getValue() >= window.state.displayProperties.top.getValue()
            && this.state.displayProperties.top.getValue() <= window.state.displayProperties.top.getValue() + window.state.displayProperties.height.getValue()) || (this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue() >= window.state.displayProperties.top.getValue()
                && this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue() <= window.state.displayProperties.top.getValue() + window.state.displayProperties.height.getValue())) || ((window.state.displayProperties.top.getValue() >= this.state.displayProperties.top.getValue()
                    && window.state.displayProperties.top.getValue() <= this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue()) || (window.state.displayProperties.top.getValue() + window.state.displayProperties.height.getValue() >= this.state.displayProperties.top.getValue()
                        && window.state.displayProperties.top.getValue() + window.state.displayProperties.height.getValue() <= this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue()));
    }

    public canItersectByWidthWith(window: Window<IWindowState>) {
        const localLeft = this.state.displayProperties.left.getValue();
        const localWidth = this.state.displayProperties.width.getValue();
        const elementLeft = window.state.displayProperties.left.getValue();
        const elementWidth = window.state.displayProperties.width.getValue();
        return ((localLeft >= elementLeft && localLeft <= elementLeft + elementWidth)
            || (localLeft + localWidth >= elementLeft && localLeft + localWidth <= elementLeft + elementWidth))
            || ((elementLeft >= localLeft && elementLeft <= localLeft + localWidth)
                || (elementLeft + elementWidth >= localLeft && elementLeft + elementWidth <= localLeft + localWidth));
    }

    public resizeChildren() {
        WindowElementContainer.resizeChildren(this);
    }

    public getInlineStyle(): IRectangleStyle {
        return Rectangle.getInlineStyle(this);
    }

    public handleScroll(event: any) {
        let update = - event.deltaY / (SketchBoard.getInstance().state.zoom * 4);
        if (this.state.scroll + update > 0) {
            update = -this.state.scroll;
        }
        this.state.scroll += update;
        const windowElements = this.state.boardElements;
        for (let i = 0, len = windowElements.data.length; i < len; ++i) {
            const sketch = windowElements.data[i];
            sketch.move(sketch.state.displayProperties.left.getValue(), sketch.state.displayProperties.top.getValue() + update);
        }
    }

    public render(): ReactNode {
        return WindowElementContainer.render(this);
    }

    public toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        return '<!DOCTYPE HTML>\n<html>\n<head>\n\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n'
            + '<link rel="stylesheet" type="text/css" href="../' + SketchBoard.getInstance().getName() + '_StyleSheet.css">'
            + '<link rel="stylesheet" type="text/css" href="' + this.name + '_StyleSheet.css">'
            + '</head>\n<body>\n'
            + WindowElementContainer.renderDomElements(this, localStyleDecleration, globalStyleDecleration)
            + '</body>\n</html>';
    }

    protected getInitialState(id: string = this.id, boardElements: HumbleArray): S {
        const state = super.getInitialState(id);
        state.boardElements = boardElements;
        Rectangle.decorateInitialState(this, state);
        state.scroll = 0;
        return state as S;
    }
}

export {
    IWindowState,
    Window,
}