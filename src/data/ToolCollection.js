import Tool from '../components/Tool';
import Sketch from '../components/Sketch'

const toolCollection = {
    Default: new Tool(
        {
            cursor: 'default',
            handleMouseDown: function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (e.target.tagName === 'MAIN') {
                    // update initTop and initLeft for all Sketches
                    for(let i=0, len=this.state.sketches.data.length; i<len; ++i)
                        this.state.sketches.data[i].updateInits(0);

                    this.props.app.state.tool.mouseState.startX = parseInt(e.clientX, 10);
                    this.props.app.state.tool.mouseState.startY = parseInt(e.clientY, 10) - this.state.top;

                    this.props.app.state.tool.mouseState.down = true;
                    this.props.app.state.tool.cursor = 'grabbing';

                    this.props.app.updateTool(this.props.app.state.tool);
                }
            },
            handleMouseMove: function(e) {
                e.preventDefault();
                e.stopPropagation();

                // if we're not dragging, just return
                if (this.props.app.state.tool.mouseState.down === false)
                    return;

                // get the current mouse position
                this.props.app.state.tool.mouseState.currentX = parseInt(e.clientX, 10);
                this.props.app.state.tool.mouseState.currentY = parseInt(e.clientY, 10) - this.state.top;

                // calculate changes and update state
                this.setState((prevState) => {
                    for(let i=0, len=prevState.sketches.data.length; i<len; ++i) {
                        prevState.sketches.data[i].state.top = prevState.sketches.data[i].state.initTop + (this.props.app.state.tool.mouseState.currentY - this.props.app.state.tool.mouseState.startY);
                        prevState.sketches.data[i].state.left = prevState.sketches.data[i].state.initLeft + (this.props.app.state.tool.mouseState.currentX - this.props.app.state.tool.mouseState.startX);
                    }
                    return {
                        sketches: prevState.sketches
                    }
                });
            },
            handleMouseUp: function(e) {
                e.preventDefault();
                e.stopPropagation();
    
                // the drag is over, clear the dragging flag
                this.props.app.state.tool.mouseState.down = false;
                this.props.app.state.tool.cursor = 'default';

                this.props.app.updateTool(this.props.app.state.tool);
            },
        }
    ),
    DrawSketch: new Tool(
        {
            cursor: 'crosshair',
            handleMouseDown: function(e) {
                e.preventDefault();
                e.stopPropagation();

                let tmp = null;
                if (e.target.tagName === 'MAIN') {
                    // calculate the sketches offset
                    toolCollection.DrawSketch.offsetLeft = this.getSketchOffset('', 'left');
                    toolCollection.DrawSketch.offsetTop = this.getSketchOffset('', 'top');

                    // save the starting x/y of the rectangle
                    this.props.app.state.tool.mouseState.startX = parseInt(e.clientX, 10) - this.props.app.state.tool.offsetLeft;
                    this.props.app.state.tool.mouseState.startY = parseInt(e.clientY, 10) - this.props.app.state.tool.offsetTop;

                    // add the Sketch to the sketchBoard
                    tmp = new Sketch(String(this.state.sketches.data.length), this.props.app, this);
                    this.state.sketches.push(tmp);
                } else {
                    // add the Sketch to the sketch
                    console.log('not yet implemented');

                    // first of, find the Sketch that gets a new Component
                    const parentId = e.target.getAttribute("uid");
                    const parent = this.findSketchByUid(this, parentId);

                    // calculate the sketches offset
                    toolCollection.DrawSketch.offsetLeft = this.getSketchOffset(parentId, 'left');
                    toolCollection.DrawSketch.offsetTop = this.getSketchOffset(parentId, 'top');

                    // save the starting x/y of the rectangle
                    this.props.app.state.tool.mouseState.startX = parseInt(e.clientX, 10) - this.props.app.state.tool.offsetLeft;
                    this.props.app.state.tool.mouseState.startY = parseInt(e.clientY, 10) - this.props.app.state.tool.offsetTop;

                    // create the new Sketch with an uid of parentId followed by its future position in the parents sketch array
                    tmp = new Sketch(String(parentId)+parent.state.sketches.data.length, this.props.app, this);
                    
                    //add the new sketch to its parents sketchRepo
                    parent.state.sketches.push(tmp);
                }
            
                this.setState((prevState) => {
                    if(prevState.selected && prevState.selected.state)
                        prevState.selected.state.selected = false;
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
                this.props.app.state.tool.mouseState.currentX = parseInt(e.clientX, 10) - this.props.app.state.tool.offsetLeft;
                this.props.app.state.tool.mouseState.currentY = parseInt(e.clientY, 10) - this.props.app.state.tool.offsetTop;

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
            this.props.app.state.tool.mouseState.startY = parseInt(e.clientY, 10) - this.state.top;

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