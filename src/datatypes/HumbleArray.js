import Component from 'react';

class HumbleArray {
    constructor(len=0) {
        this.data = new Array(len);
    }
    push(obj=null) {
        if(!(obj instanceof Component.constructor)) {
            throw Error('HumbleArray can only contain ReaktComponents.');
        }
        this.data.push(obj);
    }
    render() {
        const len = this.data.length;
        const tmp = new Array(len)
        for(let i=0; i<len; ++i) {
            tmp.push(this.data[i].hasOwnProperty('state') ? this.data[i].render() : this.data[i])
        }
        return tmp;
    }
}

export default HumbleArray;