import App from 'src/App';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import BorderBottomLeftRadius from 'src/datatypes/DisplayProperties/Properties/BorderRadius/BorderBottomLeftRadius';
import BorderBottomRightRadius from 'src/datatypes/DisplayProperties/Properties/BorderRadius/BorderBottomRightRadius';
import BorderTopLeftRadius from 'src/datatypes/DisplayProperties/Properties/BorderRadius/BorderTopLeftRadius';
import BorderTopRightRadius from 'src/datatypes/DisplayProperties/Properties/BorderRadius/BorderTopRightRadius';
import { ICoordiante, IElementContainerState, ISketchInlineStyle} from 'src/datatypes/interfaces';
import HumbleArray from '../../../datatypes/HumbleArray';
import SketchBoard from '../SketchBoard';
import ElementContainer from './ElementContainer';

class Sketch extends ElementContainer {

    constructor(id: string, app: App, sketchBoard: SketchBoard, offset: ICoordiante, sketches = new HumbleArray()) {
        super(id, app, sketchBoard, offset, sketches);
        this.state = this.getInitialSketchState();
    }

    public toString(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration, level: number): string {
        const childCount = this.state.sketches.data.length;
        const tabLevel = super.getTabLevel(level);
        if (childCount === 0) {
            return tabLevel + '<div ' + super.renderSelectors(localStyleDecleration, globalStyleDecleration) + ' />\n';
        } else {
            let result = tabLevel + '<div ' + super.renderSelectors(localStyleDecleration, globalStyleDecleration) + ' >\n';
            for (const child of this.state.sketches.data) {
                result += child.toString(localStyleDecleration, globalStyleDecleration, level + 1);
            }
            result += tabLevel + '</div>\n';
            return result;
        }
    }

    protected getInitialSketchState(): IElementContainerState {
        // border-radius
        // border-top-left-radius
        const borderTopLeftRadius = new BorderTopLeftRadius(this);
        borderTopLeftRadius.setValue(0);
        this.state.displayProperties.add(borderTopLeftRadius);
        // border-top-right-radius
        const borderTopRightRadius = new BorderTopRightRadius(this);
        borderTopRightRadius.setValue(0);
        this.state.displayProperties.add(borderTopRightRadius);
        // border-bottom-left-radius
        const borderBottomLeftRadius = new BorderBottomLeftRadius(this);
        borderBottomLeftRadius.setValue(0);
        this.state.displayProperties.add(borderBottomLeftRadius);
        // border-bottom-right-radius
        const borderBottomRightRadius = new BorderBottomRightRadius(this);
        borderBottomRightRadius.setValue(0);
        this.state.displayProperties.add(borderBottomRightRadius);
        return this.state as IElementContainerState;
    }

    protected getInlineStyle(): ISketchInlineStyle {
        const inline = super.getInlineStyle() as ISketchInlineStyle;
        inline.borderRadius = (this.state.displayProperties["border-top-left-radius"].getValue() + 'px ') + (this.state.displayProperties["border-top-right-radius"].getValue() + 'px ')
            + (this.state.displayProperties["border-bottom-left-radius"].getValue() + 'px ') + (this.state.displayProperties["border-bottom-right-radius"].getValue() + 'px');
        return inline;
    }
}

export default Sketch;