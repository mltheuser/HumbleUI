import DisplayProperty from "../DisplayProperty";

class Width extends DisplayProperty {
    protected property = 'width';
    protected value: number;
    protected convertValue() {
        if (this.parent === undefined) {
            throw(this.getNoParentErrorMessage());
        }
        return (this.getValue() / this.parent.state.displayProperties.width.getValue()) * 100 + "%";
    }
}

export default Width;