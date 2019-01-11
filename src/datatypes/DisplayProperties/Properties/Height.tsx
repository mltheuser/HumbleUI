import DisplayProperty from "../DisplayProperty";

class Height extends DisplayProperty {
    protected property = 'height';
    protected value: number;
    protected convertValue() {
        return this.element.getActuallHeight() + "px";
    }
}

export default Height;