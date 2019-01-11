import BorderProperty from './BorderProperty';

class BorderStyle extends BorderProperty{
    protected property = 'border-style';
    protected value: string;
    protected convertValue() {
        return  this.value;
    }
}

export default BorderStyle;