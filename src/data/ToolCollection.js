import Tool from '../components/Tool';
import Sketch from '../components/Sketch'

const toolCollection = {
    Default: new Tool(),
    DrawSketch: new Tool(
        {
            cursor: 'crosshair',
            handleMouseDown: function(e) {
                e.preventDefault();
                e.stopPropagation();
            
                // save the starting x/y of the rectangle
                this.props.app.state.tool.mouseState.startX = parseInt(e.clientX, 10);
                this.props.app.state.tool.mouseState.startY = parseInt(e.clientY, 10) - 4;
            
                this.setState((prevState) => {
                    const tmp = new Sketch(this.props.app);
                    prevState.sketches.push(tmp);
                    return {
                        selected: tmp,
                        sketches: prevState.sketches
                    };
                });
            
                this.props.app.state.tool.mouseState.down = true;
            },
            handleMouseMove: function(e) {
                e.preventDefault();
                e.stopPropagation();

                // if we're not dragging, just return
                if (this.props.app.state.tool.mouseState.down === false)
                    return;

                // get the current mouse position
                this.props.app.state.tool.mouseState.currentX = parseInt(e.clientX, 10);
                this.props.app.state.tool.mouseState.currentY = parseInt(e.clientY, 10) - 4;

                // calculate changes and update state
                this.setState((prevState) => {
                    prevState.selected.state.width = Math.abs(this.props.app.state.tool.mouseState.currentX - this.props.app.state.tool.mouseState.startX);
                    prevState.selected.state.height = Math.abs(this.props.app.state.tool.mouseState.currentY - this.props.app.state.tool.mouseState.startY);
                    if(this.props.app.state.tool.mouseState.currentY < this.props.app.state.tool.mouseState.startY)
                        prevState.selected.state.top = prevState.selected.state.initTop + this.props.app.state.tool.mouseState.currentY - this.props.app.state.tool.mouseState.startY;
                    if(this.props.app.state.tool.mouseState.currentX < this.props.app.state.tool.mouseState.startX)
                        prevState.selected.state.left = prevState.selected.state.initLeft + this.props.app.state.tool.mouseState.currentX - this.props.app.state.tool.mouseState.startX;
                    return {
                        selected: prevState.selected
                    }
                });
            },
            handleMouseUp: function(e) {
                e.preventDefault();
                e.stopPropagation();

                // the drag is over, clear the dragging flag
                this.props.app.state.tool.mouseState.down = false;

                this.setState((prevState) => {
                    prevState.selected.state.refined = true;
                    prevState.selected.state.selected = true;
                    return {
                        selected: prevState.selected
                    }
                });
            }
        }
    ),
    Resize: new Tool({
        handleMouseDown: function(e) {
            e.preventDefault();
            e.stopPropagation();
        
            // save the starting x/y of the rectangle
            this.props.app.state.tool.mouseState.startX = parseInt(e.clientX, 10);
            this.props.app.state.tool.mouseState.startY = parseInt(e.clientY, 10) - 4;

            this.state.selected.state.initTop = this.state.selected.state.top;
            this.state.selected.state.initLeft = this.state.selected.state.left;
            
            toolCollection.Resize.initWidth = this.state.selected.state.width;
            toolCollection.Resize.initHeight = this.state.selected.state.height;
        
            this.props.app.state.tool.mouseState.down = true;
        },
        handleMouseMove: function(e) {
            e.preventDefault();
            e.stopPropagation();

            // if we're not dragging, just return
            if (this.props.app.state.tool.mouseState.down === false)
                return;

            // get the current mouse position
            this.props.app.state.tool.mouseState.currentX = parseInt(e.clientX, 10);
            this.props.app.state.tool.mouseState.currentY = parseInt(e.clientY, 10) - 4;

            // calculate changes and update state
            this.setState((prevState) => {

                // change horizontal
                switch(this.props.app.state.tool.horizontal) {
                    case 1:
                        prevState.selected.state.left = prevState.selected.state.initLeft + (this.props.app.state.tool.mouseState.currentX - this.props.app.state.tool.mouseState.startX);
                        prevState.selected.state.width = this.props.app.state.tool.initWidth - (this.props.app.state.tool.mouseState.currentX - this.props.app.state.tool.mouseState.startX);
                        if((this.props.app.state.tool.mouseState.currentX - this.props.app.state.tool.mouseState.startX) > this.props.app.state.tool.initWidth) {
                            prevState.selected.state.left = prevState.selected.state.initLeft + this.props.app.state.tool.initWidth;
                            prevState.selected.state.width = (this.props.app.state.tool.mouseState.currentX - this.props.app.state.tool.mouseState.startX) - this.props.app.state.tool.initWidth;
                        }
                    break;
                    case 2:
                        prevState.selected.state.width = this.props.app.state.tool.initWidth + (this.props.app.state.tool.mouseState.currentX - this.props.app.state.tool.mouseState.startX);
                        if(prevState.selected.state.width < 0)
                            prevState.selected.state.left = prevState.selected.state.initLeft + prevState.selected.state.width;
                        prevState.selected.state.width = Math.abs(prevState.selected.state.width);
                    break;
                    default:

                    break;
                }

                // change vertical
                switch(this.props.app.state.tool.vertical) {
                    case 1:
                        prevState.selected.state.top = prevState.selected.state.initTop + (this.props.app.state.tool.mouseState.currentY - this.props.app.state.tool.mouseState.startY);
                        prevState.selected.state.height = this.props.app.state.tool.initHeight - (this.props.app.state.tool.mouseState.currentY - this.props.app.state.tool.mouseState.startY);
                        
                        if((this.props.app.state.tool.mouseState.currentY - this.props.app.state.tool.mouseState.startY) > this.props.app.state.tool.initHeight) {
                            prevState.selected.state.top = prevState.selected.state.initTop + this.props.app.state.tool.initHeight;
                            prevState.selected.state.height = (this.props.app.state.tool.mouseState.currentY - this.props.app.state.tool.mouseState.startY) - this.props.app.state.tool.initHeight;
                        }
                    break;
                    case 2:
                        prevState.selected.state.height = this.props.app.state.tool.initHeight + (this.props.app.state.tool.mouseState.currentY - this.props.app.state.tool.mouseState.startY);
                        if(prevState.selected.state.height < 0)
                            prevState.selected.state.top = prevState.selected.state.initTop + prevState.selected.state.height;
        
                        prevState.selected.state.height = Math.abs(prevState.selected.state.height);
                    break;
                    default:

                    break;
                }

                return {
                    selected: prevState.selected
                }

            });
        },
        handleMouseUp: function(e) {
            e.preventDefault();
            e.stopPropagation();

            // the drag is over, clear the dragging flag
            this.props.app.state.tool.mouseState.down = false;

            if(document.querySelector('#'+this.props.app.state.tool.selectorID+':hover') === null) {
                if(this.props.app.state.tool.toolRepo === null || this.props.app.state.tool.mouseState.down === true)
                    return;
                this.props.app.updateTool(this.props.app.state.tool.toolRepo);
                this.props.app.state.tool.toolRepo = null;
            }
        }
    })
}

export default toolCollection