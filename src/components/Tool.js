class Tool {
    constructor(params=null) {
        if(params === null)
            params = {};

        const defaultHandle = function() {return;};

        this.cursor = params.cursor === undefined ? 'default' : params.cursor;
        this.handleMouseDown = params.handleMouseDown === undefined ? defaultHandle : params.handleMouseDown;
        this.handleMouseMove = params.handleMouseMove === undefined ? defaultHandle : params.handleMouseMove;
        this.handleMouseUp = params.handleMouseUp === undefined ? defaultHandle : params.handleMouseUp;
        this.mouseState = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            down: false
        }
    }
}

export default Tool;