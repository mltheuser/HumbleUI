import Element from 'src/components/Board/Element';
import { IElementState } from '../interfaces';
import CssRule from './CssRule';

class Id extends CssRule {
    public constructor(public subject: Element<IElementState>) {
        super([subject]);
    }

    public getSubject(): Element<IElementState> {
        return this.subjects[0];
    }

    public getSelectorName() {
        return this.getSubject().name
    }

    public toString() {
        let result = '#' + this.getSelectorName() + ' {\n';
        result += this.getPropertyValuePairStrings();
        result += '}\n\n';
        return result;
    }
}

export default Id;