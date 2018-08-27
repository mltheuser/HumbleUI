import Tool from './Tool';
import Sketch from './Sketch'

const toolCollection = {
    Default: new Tool(
        'default',
        {
            handleMouseDown: function(e) {
                e.preventDefault();
                e.stopPropagation();
            
                return;
            },
            handleMouseMove: function(e) {
                e.preventDefault();
                e.stopPropagation();

                return;
            },
            handleMouseUp: function(e) {
                e.preventDefault();
                e.stopPropagation();

                return;
            }
        }
    ),
    DrawSketch: new Tool(
        'crosshair',
        {
            handleMouseDown: function(e) {
                e.preventDefault();
                e.stopPropagation();
            
                // save the starting x/y of the rectangle
                this.props.tool.mouseState.startX = parseInt(e.clientX, 10);
                this.props.tool.mouseState.startY = parseInt(e.clientY, 10) - 4;
            
                this.setState((prevState) => {
                    const tmp = new Sketch(this.props.tool.mouseState.startY, this.props.tool.mouseState.startX);
                    prevState.sketches.push(tmp);
                    return {
                        selected: tmp,
                        sketches: prevState.sketches
                    };
                });
            
                this.props.tool.mouseState.down = true;
            },
            handleMouseMove: function(e) {
                e.preventDefault();
                e.stopPropagation();

                // if we're not dragging, just return
                if (this.props.tool.mouseState.down === false)
                    return;

                // get the current mouse position
                this.props.tool.mouseState.currentX = parseInt(e.clientX, 10);
                this.props.tool.mouseState.currentY = parseInt(e.clientY, 10) - 4;

                // calculate changes and update state
                this.setState((prevState) => {
                    prevState.selected.state.width = Math.abs(this.props.tool.mouseState.currentX - this.props.tool.mouseState.startX);
                    prevState.selected.state.height = Math.abs(this.props.tool.mouseState.currentY - this.props.tool.mouseState.startY);
                    if(this.props.tool.mouseState.currentY < this.props.tool.mouseState.startY)
                        prevState.selected.state.top = prevState.selected.state.initTop + this.props.tool.mouseState.currentY - this.props.tool.mouseState.startY;
                    if(this.props.tool.mouseState.currentX < this.props.tool.mouseState.startX)
                        prevState.selected.state.left = prevState.selected.state.initLeft + this.props.tool.mouseState.currentX - this.props.tool.mouseState.startX;
                    return {
                        selected: prevState.selected
                    }
                });
            },
            handleMouseUp: function(e) {
                e.preventDefault();
                e.stopPropagation();

                // the drag is over, clear the dragging flag
                this.props.tool.mouseState.down = false;

                this.setState((prevState) => {
                    prevState.selected.state.refined = true;
                    prevState.selected.state.selected = true;
                    return {
                        selected: prevState.selected
                    }
                });
            }
        }
    )
}

export default toolCollection