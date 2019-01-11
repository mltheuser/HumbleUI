import App from 'src/App';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import HumbleArray from 'src/datatypes/HumbleArray';
import { ICoordiante, IWindowSketchState } from 'src/datatypes/interfaces';
import SketchBoard from '../SketchBoard';
import ElementContainer from './ElementContainer';


class WindowSketch extends ElementContainer {

    public state: IWindowSketchState = this.getInitialWindowSketchState();

    constructor(id: string, app: App, sketchBoard: SketchBoard, offset: ICoordiante, sketches = new HumbleArray()) {
        super(id, app, sketchBoard, offset, sketches);
    }

    public handleScroll(event: any) {
        let update = - event.deltaY / (this.sketchBoard.state.zoom * 4);
        if (this.state.scroll + update > 0) {
            update = -this.state.scroll;
        }
        this.state.scroll += update;
        for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
            const sketch = this.state.sketches.data[i];
            sketch.move(sketch.state.displayProperties.left.getValue(), sketch.state.displayProperties.top.getValue() + update);
        }
    }

    public toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        return '<!DOCTYPE HTML>\n<html>\n<head>\n\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n'
            + '<link rel="stylesheet" type="text/css" href="../' + this.sketchBoard.name + '_StyleSheet.css">'
            + '<link rel="stylesheet" type="text/css" href="' + this.name + '_StyleSheet.css">'
            + '</head>\n<body>\n'
            + this.renderDomElements(localStyleDecleration, globalStyleDecleration)
            + '</body>\n</html>';
    }

    protected getInitialWindowSketchState(): IWindowSketchState {
        const state = this.state as IWindowSketchState;
        state.scroll = 0;
        return this.state as IWindowSketchState;
    }

    private renderDomElements(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        let result = '';
        for (const child of this.state.sketches.data) {
            result += child.toString(localStyleDecleration, globalStyleDecleration, 1);
        }
        return result;
    }
}

export default WindowSketch;