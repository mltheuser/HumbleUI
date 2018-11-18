class Tool {

    public cursor = 'default';

    public offsetLeft: number = 0;

    public offsetTop: number = 0;

    public toolRepo: Tool | null;

    public horizontal: number;

    public vertical: number;

    public selectorID: string;

    public mouseState = {
        currentX: 0,
        currentY: 0,
        down: false,
        startX: 0,
        startY: 0,
    }

    public constructor(params: any = {}) {
        if (params.cursor) {
            this.cursor = params.cursor;
        }
        if (params.handleMouseDown) {
            this.handleMouseDown = params.handleMouseDown;
        }
        if (params.handleMouseMove) {
            this.handleMouseMove = params.handleMouseMove;
        }
        if (params.handleMouseUp) {
            this.handleMouseUp = params.handleMouseUp;
        }
    }

    public handleMouseDown = () => { return; };

    public handleMouseMove = () => { return; };

    public handleMouseUp = () => { return; };

    public bind(component: React.Component) {
        this.handleMouseDown = this.handleMouseDown.bind(component);
        this.handleMouseMove = this.handleMouseMove.bind(component);
        this.handleMouseUp = this.handleMouseUp.bind(component);
    }
}

export default Tool;