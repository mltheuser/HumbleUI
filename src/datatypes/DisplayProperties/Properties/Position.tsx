import DisplayProperty from "../DisplayProperty";

class Position extends DisplayProperty {
    protected property = 'position';
    protected value: string;
    protected convertValue() {
        return this.value;
    }
}

export default Position;