import { BoardElement, IBoardElementState } from 'src/components/Board/BoardElement';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import DisplayProperty from '../../DisplayProperty';

abstract class BorderProperty extends DisplayProperty{
    protected element: BoardElement<IBoardElementState>;
    public addRule(cssStyleDeclaration: CssStyleDeclaration) {
        if (this.element.state.displayProperties.borderIsChecked() === true) {
            super.addRule(cssStyleDeclaration);
        }
    }
}

export default BorderProperty;