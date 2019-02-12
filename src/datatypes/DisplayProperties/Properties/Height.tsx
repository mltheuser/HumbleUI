import { BoardElement, IBoardElementState } from 'src/components/Board/BoardElement';
import DisplayProperty from '../DisplayProperty';

class Height extends DisplayProperty {
    protected element: BoardElement<IBoardElementState>;
    protected property = 'height';
    protected value: number;
    protected convertValue() {
        return this.element.getActuallHeight() + "px";
    }
}

export default Height;