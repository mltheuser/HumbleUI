import Element from 'src/components/Board/Element';
import { IElementState } from '../interfaces';
import CssRule from "./CssRule";

class Class extends CssRule {
    public addSubject(subject: Element<IElementState>) {
        this.subjects.push(subject);
    }

    public removeSubject(subject: Element<IElementState>) {
        const index = this.subjects.indexOf(subject);
        if (index > -1) {
            this.subjects.splice(index, 1);
        } else {
            throw EvalError('the given subject does not exist on this Class.');
        }
    }

    public getSelectorName() {
        let result = '';
        for (const subject of this.subjects) {
            result += subject.name.substr(0, 4);
        }
        return result;
    }

    public toString() {
        let result = '.' + this.getSelectorName() + ' {\n';
        result += this.getPropertyValuePairStrings();
        result += '}\n\n';
        return result;
    }
}

export default Class;