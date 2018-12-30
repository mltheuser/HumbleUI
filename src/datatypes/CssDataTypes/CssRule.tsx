import Element from 'src/components/Element';
import { ICssPropertyValuePairs, IElementState } from '../interfaces';

class CssRule {

    private propertyValuePairs: ICssPropertyValuePairs = {};

    public constructor(public subjects: Array<Element<IElementState>>) {

    }

    public addPropertyValuePair(CssProperty: string, value: string) {
        this.propertyValuePairs[CssProperty] = value;
    }

    public removePropertyValuePair(CssProperty: string, value: string) {
        if (this.propertyValuePairs[CssProperty] !== value) {
            throw EvalError("The given pair CssProperty -> value does not exist on this rule.");
        }
        delete this.propertyValuePairs[CssProperty];
    }

    public getPropertyValuePairCount(): number {
        return Object.keys(this.propertyValuePairs).length;
    }

    protected getPropertyValuePairStrings() {
        let result = '';
        for (const cssProperty of Object.keys(this.propertyValuePairs)) {
            result += '\t' + cssProperty + ': ' + this.propertyValuePairs[cssProperty] + ';\n'
        }
        return result;
    }
}

export default CssRule;