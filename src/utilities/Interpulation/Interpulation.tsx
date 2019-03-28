import { ICoordinate } from "src/datatypes/Coordinate";

interface IInterpulationDataElement extends ICoordinate {
    z: number,
}

class Interpulation {

    public constructor(data: IInterpulationDataElement[]) {
        console.log(data);
    }

}

export {
    IInterpulationDataElement,
    Interpulation,
}