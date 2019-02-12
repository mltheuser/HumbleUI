import { BoardElement, IBoardElementState } from 'src/components/Board/BoardElement';

class HumbleArray {

    public data: Array<BoardElement<IBoardElementState>>;

    public constructor(len = 0) {
        this.data = new Array(len);
    }

    public push(boardElement: BoardElement<IBoardElementState>) {
        this.data.push(boardElement);
    }

    public getElementAtIndex(index: number): BoardElement<IBoardElementState> {
        return this.data[index];
    }

    public [Symbol.iterator]() {
        return this.data.values()
    }

    public render() {
        const len = this.data.length;
        const tmp = new Array(len);
        for (let i = 0; i < len; ++i) {
            tmp.push(this.data[i].hasOwnProperty('state') ? this.data[i].render() : this.data[i])
        }
        return tmp;
    }
}

export default HumbleArray;