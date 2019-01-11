import DisplayProperty from "../../DisplayProperty";

abstract class BorderRadius extends DisplayProperty {
    protected property: string;
    protected value: string;
    protected convertValue() {
        return this.value + "px";
    }
}

export default BorderRadius;