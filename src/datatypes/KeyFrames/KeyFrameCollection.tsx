import * as regression from 'regression';
import { IWindowState, Window } from 'src/components/Board/BoardElements/Window';
import { IWindowElementState, WindowElement } from 'src/components/Board/BoardElements/WindowElement';
import { SketchBoard } from 'src/components/Board/SketchBoard';
import { IInterpulationDataElement, Interpulation } from 'src/utilities/Interpulation/Interpulation';
import { Coordinate } from '../Coordinate';
import DisplayPropertyCollection from '../DisplayProperties/DisplayPropertyCollection';

class KeyFrameCollection {

    private element: WindowElement<IWindowElementState>;

    private window: Window<IWindowState>;

    private collection: Map<Coordinate, DisplayPropertyCollection> = new Map<Coordinate, DisplayPropertyCollection>();

    private functionCache: Map<string, Interpulation> = new Map<string, Interpulation>();

    constructor(element: WindowElement<IWindowElementState>, elementID: string) {
        this.element = element;
        this.assignParentWindowById(elementID);
    }

    public add(key: Coordinate, value: DisplayPropertyCollection) {
        this.collection.set(key, value);
    }

    public mapCurrentFrame() {
        const currentFrameState = new Coordinate(
            this.window.state.displayProperties.width.getValue(),
            this.window.state.displayProperties.height.getValue(),
        )
        this.add(
            currentFrameState,
            this.element.state.displayProperties.clone(),
        );
        this.updateResponseFunctions();
    }

    public init() {
        this.collection.clear();
        this.mapCurrentFrame();
        this.mapZeroFrame();
        this.updateResponseFunctions();
    }

    public updateResponseFunctions() {
        for(const propertyKey in this.functionCache) {
            if (this.functionCache.hasOwnProperty(propertyKey)) {
                this.createResponseFunction(propertyKey);
            }
        }
    }

    public getResponseFunctionForProperty(propertyKey: string): regression.Result {
        if (this.functionCache[propertyKey] === undefined) {
            this.createResponseFunction(propertyKey);
        }
        return this.functionCache[propertyKey];
    }

    private mapZeroFrame() {
        const zeroFrameState = new Coordinate(
            0,
            0,
        );
        const displayPropertiesClone = this.element.state.displayProperties.clone();
        displayPropertiesClone.width.setValue(0);
        displayPropertiesClone.left.setValue(0);
        this.add(
            zeroFrameState,
            displayPropertiesClone,
        );
    }

    private createResponseFunction(propertyKey: string) {
        const data = new Array<IInterpulationDataElement>();
        for(const keyFrame of this.collection) {
            data.push({
                x: keyFrame[0].x,
                y: keyFrame[0].y,
                z: keyFrame[1][propertyKey].getValue(),
            });
        }
        this.functionCache[propertyKey] = new Interpulation(data);
    }

    private assignParentWindowById(elementID: string) {
        const sketchBoard = SketchBoard.getInstance();
        const window = sketchBoard.findElementById(sketchBoard, elementID[0]);
        if (window == null || window instanceof Window === false) {
            throw new EvalError("Every WindowElement should live in a Window.")
        }
        this.window = window as Window<IWindowState>;
    }

}

export default KeyFrameCollection;