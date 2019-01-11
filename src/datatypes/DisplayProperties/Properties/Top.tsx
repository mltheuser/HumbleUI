import DisplayProperty from "../DisplayProperty";

class Top extends DisplayProperty {
    protected property = 'top';
    protected value: number;
    protected convertValue() {
        return  this.element.getActuallTop() + "px";
    }
}

export default Top;