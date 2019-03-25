import { IWindowState, Window } from 'src/components/Board/BoardElements/Window';
import { IWindowElementState, WindowElement } from 'src/components/Board/BoardElements/WindowElement';
import { SketchBoard } from 'src/components/Board/SketchBoard';
import { Coordinate } from "../Coordinate";
import DisplayPropertyCollection from '../DisplayProperties/DisplayPropertyCollection';

class KeyFrameCollection {

    private element: WindowElement<IWindowElementState>;

    private window: Window<IWindowState>;

    private collection: Map<Coordinate, DisplayPropertyCollection> = new Map<Coordinate, DisplayPropertyCollection>();

    constructor(element: WindowElement<IWindowElementState>, elementID: string) {
        this.element = element;
        this.assignParentWindowById(elementID);
    }

    public add(key: Coordinate, value: DisplayPropertyCollection) {
        this.collection.set(key, value);
    }

    public mapCurrentFrame() {
        const currentWindowState = new Coordinate(
            this.window.state.displayProperties.width.getValue(),
            this.window.state.displayProperties.height.getValue(),
        );
        this.add(
            currentWindowState,
            this.element.state.displayProperties.clone(),
        );
    }

    public init() {
        this.collection.clear();
        this.mapCurrentFrame();
        this.mapZeroFrame();
        console.log(this.collection);
    }

    private mapZeroFrame() {
        const zeroWindowState = new Coordinate(
            0,
            0,
        );
        const displayPropertiesClone = this.element.state.displayProperties.clone();
        displayPropertiesClone.width.setValue(0);
        displayPropertiesClone.left.setValue(0);
        this.add(
            zeroWindowState,
            displayPropertiesClone,
        );
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