import App from 'src/App';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import HumbleArray from 'src/datatypes/HumbleArray';
import { ICoordiante } from 'src/datatypes/interfaces';
import Sketch from "./Sketch";
import SketchBoard from './SketchBoard';


class WindowSketch extends Sketch {
    constructor(id: string, app: App, sketchBoard: SketchBoard, offset: ICoordiante, sketches = new HumbleArray()) {
        super(id, app, sketchBoard, offset);
        this.state = this.getInitialSketchState(sketches);
    }

    public handleScroll(event: any) {
        let update = - event.deltaY / (this.sketchBoard.state.zoom * 4);
        if (this.state.scroll + update > 0) {
            update = -this.state.scroll;
        }
        this.state.scroll += update;
        for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
            const sketch = this.state.sketches.data[i];
            sketch.move(sketch.state.left, sketch.state.top + update);
        }
    }

    public extractStyleDeclaration(): CssStyleDeclaration {
        const resultDeclaration = new CssStyleDeclaration();
        for (const child of this.state.sketches.data) {
            resultDeclaration.unite(child.extractStyleDeclaration());
        }
        return resultDeclaration;
    }

    public toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        return '<!DOCTYPE HTML>\n<html>\n<head>\n\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n'
            + '<link rel="stylesheet" type="text/css" href="../' + this.sketchBoard.name + '_StyleSheet.css">'
            + '<link rel="stylesheet" type="text/css" href="' + this.name + '_StyleSheet.css">'
            + '</head>\n<body>\n'
            + this.renderDomElements(localStyleDecleration, globalStyleDecleration)
            + '</body>\n</html>';
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