import Sketch from 'src/components/Board/Elements/Sketch';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import DisplayProperty from '../../DisplayProperty';

abstract class BorderProperty extends DisplayProperty{
    protected element: Sketch;
    public addRule(cssStyleDeclaration: CssStyleDeclaration) {
        if (this.element.state.borderChecked === true) {
            super.addRule(cssStyleDeclaration);
        }
    }
}

export default BorderProperty;