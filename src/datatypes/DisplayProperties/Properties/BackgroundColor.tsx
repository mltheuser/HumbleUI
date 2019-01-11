import DisplayProperty from "../DisplayProperty";

class BackgroundColor extends DisplayProperty {
    protected property = 'background-color';
    protected value: string;
    protected convertValue() {
        return this.value;
    }
}

export default BackgroundColor;