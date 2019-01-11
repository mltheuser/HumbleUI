import BorderProperty from './BorderProperty';

class BorderWidth extends BorderProperty{
    protected property = 'border-width';
    protected value: number;
    protected convertValue() {
        return  this.value + "px";
    }
}

export default BorderWidth;