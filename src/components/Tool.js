class Tool {
    constructor(cursor, handlers) {
        this.cursor = cursor;
        this.handleMouseDown = handlers.handleMouseDown;
        this.handleMouseMove = handlers.handleMouseMove;
        this.handleMouseUp = handlers.handleMouseUp;
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