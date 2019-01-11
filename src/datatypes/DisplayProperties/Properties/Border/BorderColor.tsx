import BorderProperty from './BorderProperty';

class BorderColor extends BorderProperty{
    protected property = 'border-color';
    protected value: string;
    protected convertValue() {
        return  this.element.getActuallHeight() + "px";
    }
}

export default BorderColor;