import Element, { IElementState } from 'src/components/Element';

class HumbleArray {

    public data: Array<Element<IElementState>>;

    public constructor(len = 0) {
        this.data = new Array(len);
    }

    public push(obj: Element<IElementState>) {
        this.data.push(obj);
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