class Distance {
    constructor(from, to) {
        this.from = from;
        this.to = to;

        // calculate distances
        this.distance = {
            X: this.calculateDistX(from, to),
            Y: 0
        }
    }

    calculateDistX(from, to) {
        const tmp1 = to.state.left + to.state.width - from.state.left, tmp2 = to.state.left - (from.state.left + from.state.width);
        return tmp1 < tmp2 ? tmp1 : tmp2;
    }
}

export default Distance;