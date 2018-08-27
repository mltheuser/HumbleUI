import Component from 'react';

class HumbleArray {
    constructor(len=0) {
        this.data = new Array(len);
    }
    push(obj=null) {
        if(!(obj instanceof Component.constructor))
            throw Error('HumbleArray can only contain ReaktComponents.');
        this.data.push(obj);
    }
    render() {
        let i=0, len=this.data.length, tmp = new Array(len)
        for(; i<len; ++i)
            tmp.push(this.data[i].hasOwnProperty('state') ? this.data[i].render() : this.data[i])
        return tmp;
    }
}

export default HumbleArray;