import * as React from 'react';
import { Coordinate } from 'src/datatypes/Coordinate';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import DisplayPropertyCollection from 'src/datatypes/DisplayProperties/DisplayPropertyCollection';
import Height from 'src/datatypes/DisplayProperties/Properties/Height';
import Left from 'src/datatypes/DisplayProperties/Properties/Left';
import Top from 'src/datatypes/DisplayProperties/Properties/Top';
import Width from 'src/datatypes/DisplayProperties/Properties/Width';
import HumbleArray from 'src/datatypes/HumbleArray';
import { AbsolutePositionedComponent, IAbsolutePositionedComponent, IAbsolutePositionedComponentState } from '../AbsolutePositionedComponent';
import { SketchBoard } from './SketchBoard';

interface IBoardElementState extends IAbsolutePositionedComponentState {
    inEditMode: boolean,
    refined: boolean,
    isSelected: boolean,
}

interface IBoardElementStyle {
    height: number | string,
    left: number | string,
    top: number | string,
    width: number | string,
}

interface IInitValues {
    height: number;
    left: number;
    top: number;
    width: number;
}

interface IBoardElement extends IAbsolutePositionedComponent {
    state: IBoardElementState,
    getId(): string,
    getInitValues(): IInitValues
    getLeftBorder(): number,
    getRightBorder(): number,
    getTopBorder(): number,
    getBottomBorder(): number,
    getActuallHeight(): number,
    getActuallWidth(): number
    getStyleDecleration(): CssStyleDeclaration,
    move(left: number, top: number): void,
    getInlineStyle(): IBoardElementStyle,
    render(): React.ReactNode,
    toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration, level: number): string,
}

abstract class BoardElement<S extends IBoardElementState> extends AbsolutePositionedComponent<S> implements IBoardElement {

    public state: S;
    
    protected id: string;

    protected initValues: IInitValues = {
        height: 0,
        left: 0,
        top: 0,
        width: 0,
    };

    constructor(id: string, boardElements: HumbleArray = new HumbleArray()) {
        super(id, boardElements);
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }

    public getInitValues(): IInitValues {
        return this.initValues;
    }

    public getLeftBorder(): number {
        return this.state.displayProperties.left.getValue();
    }

    public getRightBorder(): number {
        return this.state.displayProperties.left.getValue() + this.state.displayProperties.width.getValue();
    }

    public getTopBorder(): number {
        return this.state.displayProperties.top.getValue();
    }

    public getBottomBorder(): number {
        return this.state.displayProperties.top.getValue() + this.state.displayProperties.height.getValue();
    }

    public getCenter(): Coordinate {
        return new Coordinate(
            this.getLeftBorder() + (this.getRightBorder() - this.getLeftBorder()) / 2,
            this.getTopBorder() + (this.getBottomBorder() - this.getTopBorder()) / 2,
        );
    }

    public getActuallHeight(): number {
        return this.state.displayProperties.height.getValue() / SketchBoard.getInstance().state.zoom;
    }

    public getActuallleft(): number {
        return this.state.displayProperties.left.getValue() / SketchBoard.getInstance().state.zoom;
    }

    public getActuallTop(): number {
        return this.state.displayProperties.top.getValue() / SketchBoard.getInstance().state.zoom;
    }

    public getActuallWidth(): number {
        return this.state.displayProperties.width.getValue() / SketchBoard.getInstance().state.zoom;
    }

    public getStyleDecleration(): CssStyleDeclaration {
        const localDeclaration = new CssStyleDeclaration();
        this.state.displayProperties.addToStyleDecleration(localDeclaration);
        return localDeclaration;
    }

    public updateInits(mode: number = 2): void {
        if (mode > 0) {
            this.initValues.height = this.state.displayProperties.height.getValue();
            this.initValues.width = this.state.displayProperties.width.getValue();
        }
        if (mode !== 1) {
            this.initValues.top = this.state.displayProperties.top.getValue();
            this.initValues.left = this.state.displayProperties.left.getValue();
        }
    }

    public move(left: number, top: number) {
        this.state.displayProperties.left.setValue(left);
        this.state.displayProperties.top.setValue(top);
    }

    public abstract getInlineStyle(): IBoardElementStyle

    public abstract render(): React.ReactNode;

    public abstract toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration, level: number): string;

    protected getInitialState(id: string = this.id, boardElements: HumbleArray = new HumbleArray()): S {
        // check if valid id
        if (!id || typeof id !== 'string' || id.length < 1) {
            throw ReferenceError("id is invalid.");
        }
        // calculate offset by Id
        console.log(id);
        const offset = SketchBoard.calculateOffSetById(id);
        console.log(offset);
        // fill a displayPropertyCollection with inital values
        const displayProperties = new DisplayPropertyCollection();
        // top
        const top = new Top(this);
        top.setValue(SketchBoard.getInstance().state.tool.mouseState.startY - offset.y);
        displayProperties.add(top);
        // left
        const left = new Left(this);
        left.setValue(SketchBoard.getInstance().state.tool.mouseState.startX - offset.x);
        displayProperties.add(left);
        // height
        const height = new Height(this);
        height.setValue(0);
        displayProperties.add(height);
        // width
        const width = new Width(this);
        width.setValue(0);
        displayProperties.add(width);
        //
        // return the state object as instance of IBoardElementState
        return {
            displayProperties,
            inEditMode: false,
            isSelected: false,
            refined: false,
        } as S;
    }

    protected getInitalName(): string {
        return this.constructor.name + this.id;
    };
}

export {
    IBoardElementState,
    IBoardElementStyle,
    IInitValues,
    IBoardElement,
    BoardElement,
};