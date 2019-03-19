
interface ICoordinate {
    x: number,
    y: number,
}

class Coordinate implements ICoordinate {

    public static add(a1: Coordinate, a2: Coordinate) {
        return new Coordinate(
            a1.x + a2.x,
            a1.y + a2.y,
        );
    }

    public static sub(a1: Coordinate, a2: Coordinate) {
        return new Coordinate(
            a1.x - a2.x,
            a1.y - a2.y,
        );
    }

    public x: number;

    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

}

export { 
    ICoordinate,
    Coordinate,
}