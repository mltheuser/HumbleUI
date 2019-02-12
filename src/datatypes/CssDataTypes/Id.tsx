import { BoardElement, IBoardElementState } from 'src/components/Board/BoardElement';
import CssRule from './CssRule';

class Id extends CssRule {
    public constructor(public subject: BoardElement<IBoardElementState>) {
        super([subject]);
    }

    public getSubject(): BoardElement<IBoardElementState> {
        return this.subjects[0];
    }

    public getSelectorName() {
        return this.getSubject().getName();
    }

    public toString() {
        let result = '#' + this.getSelectorName() + ' {\n';
        result += this.getPropertyValuePairStrings();
        result += '}\n\n';
        return result;
    }
}

export default Id;