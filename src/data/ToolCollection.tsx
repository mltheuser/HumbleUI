import Sketch from '../components/Sketch'
import Tool from '../components/Tool';

const toolCollection = {
    Default: new Tool(
        {
            cursor: 'default',
            handleMouseDown (e: any) {
                e.preventDefault();
                e.stopPropagation();

                const tool = this.state.tool;

                tool.dragged = 0;

                switch (e.target.tagName) {
                    case 'MAIN':
                        this.updateInits(0);

                        tool.target = null;
                        break;
                    case 'DIV':
                        const target = this.findElementById(this, e.target.getAttribute("id"));
                        tool.target = target;

                        if (this.state.selected === null) {
                            return;
                        }

                        this.state.selected.updateInits(0);

                        if (target.isFamilyMemberOf(this.state.selected) === false) {
                            return;
                        }
                        break;
                    default: return;
                }

                tool.mouseState.startX = parseInt(e.clientX, 10);
                tool.mouseState.startY = parseInt(e.clientY, 10) - this.state.top;

                tool.mouseState.down = true;
                tool.cursor = 'grabbing';
            },
            handleMouseMove (e: any) {
                e.preventDefault();
                e.stopPropagation();

                const tool = this.state.tool;

                // if we're not dragging, just return
                if (tool.mouseState.down === false) {
                    return;
                }

                // get the current mouse position
                tool.mouseState.currentX = parseInt(e.clientX, 10);
                tool.mouseState.currentY = parseInt(e.clientY, 10) - this.state.top;

                const updateY = (tool.mouseState.currentY - tool.mouseState.startY);
                const updateX = (tool.mouseState.currentX - tool.mouseState.startX);

                if (tool.dragged === 0) {
                    if (updateX !== 0 || updateY !== 0) {
                        tool.dragged = 1;
                    }
                }

                // calculate change and update state
                if (tool.target === undefined || tool.target === null) {
                    for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                        const sketch = this.state.sketches.data[i];
                        sketch.state.top = sketch.initTop + updateY;
                        sketch.state.left = sketch.initLeft + updateX;
                    }
                } else {
                    this.state.selected.state.top = this.state.selected.initTop + updateY;
                    this.state.selected.state.left = this.state.selected.initLeft + updateX;
                }
                this.setState({});
            },
            handleMouseUp (e: any) {
                e.preventDefault();
                e.stopPropagation();

                const tool = this.state.tool;

                if (tool.dragged === 0 && tool.target !== undefined) {
                    this.updateSelection(tool.target);
                }

                // the drag is over, clear the dragging flag
                tool.mouseState.down = false;
                tool.cursor = 'default';
                tool.target = undefined;
            },
        }
    ),
    DrawSketch: new Tool(
        {
            cursor: 'crosshair',
            handleMouseDown (e: any) {
                e.preventDefault();
                e.stopPropagation();

                let tmp: any = null;
                const tool = this.state.tool;
                if (e.target.tagName === 'MAIN') {
                    // calculate the sketches offset
                    toolCollection.DrawSketch.offsetLeft = this.getSketchOffset('', 'left');
                    toolCollection.DrawSketch.offsetTop = this.getSketchOffset('', 'top');

                    // save the starting x/y of the rectangle
                    tool.mouseState.startX = parseInt(e.clientX, 10) - tool.offsetLeft;
                    tool.mouseState.startY = parseInt(e.clientY, 10) - tool.offsetTop;

                    // add the Sketch to the sketchBoard
                    tmp = new Sketch(String(this.state.sketches.data.length), this.props.app, this);
                    this.state.sketches.push(tmp);
                } else {
                    // first of, find the Sketch that gets a new Component
                    const parentId = e.target.getAttribute("id");
                    const parent = this.findElementById(this, parentId);

                    // calculate the sketches offset
                    toolCollection.DrawSketch.offsetLeft = this.getSketchOffset(parentId, 'left');
                    toolCollection.DrawSketch.offsetTop = this.getSketchOffset(parentId, 'top');

                    // save the starting x/y of the rectangle
                    tool.mouseState.startX = parseInt(e.clientX, 10) - tool.offsetLeft;
                    tool.mouseState.startY = parseInt(e.clientY, 10) - tool.offsetTop;

                    // create the new Sketch with an id of parentId followed by its future position in the parents sketch array
                    tmp = new Sketch(String(parentId) + parent.state.sketches.data.length, this.props.app, this);

                    // add the new sketch to its parents sketchRepo
                    parent.state.sketches.push(tmp);
                }

                this.setState((prevState: any) => {
                    if (prevState.selected && prevState.selected.state) {
                        prevState.selected.state.selected = false;
                    }
                    return {
                        selected: tmp,
                        sketches: prevState.sketches
                    };
                });

                tool.mouseState.down = true;
            },
            handleMouseMove (e: any) {
                e.preventDefault();
                e.stopPropagation();

                const tool = this.state.tool;

                // if we're not dragging, just return
                if (tool.mouseState.down === false) {
                    return;
                }

                // get the current mouse position
                tool.mouseState.currentX = parseInt(e.clientX, 10) - tool.offsetLeft;
                tool.mouseState.currentY = parseInt(e.clientY, 10) - tool.offsetTop;

                // calculate changes and update state
                this.setState((prevState: any) => {
                    prevState.selected.state.width = Math.abs(tool.mouseState.currentX - tool.mouseState.startX);
                    prevState.selected.state.height = Math.abs(tool.mouseState.currentY - tool.mouseState.startY);
                    if (tool.mouseState.currentY < tool.mouseState.startY) {
                        prevState.selected.state.top = prevState.selected.initTop + tool.mouseState.currentY - tool.mouseState.startY;
                    }
                    if (tool.mouseState.currentX < tool.mouseState.startX) {
                        prevState.selected.state.left = prevState.selected.initLeft + tool.mouseState.currentX - tool.mouseState.startX;
                    }
                    return {
                        selected: prevState.selected
                    }
                });
            },
            handleMouseUp (e: any) {
                e.preventDefault();
                e.stopPropagation();

                const tool = this.state.tool;

                // the drag is over, clear the dragging flag
                tool.mouseState.down = false;

                this.setState((prevState: any) => {
                    prevState.selected.state.refined = true;
                    prevState.selected.state.selected = true;
                    return {
                        selected: prevState.selected
                    }
                });

                this.props.app.setState({});
            }
        }
    ),
    Resize: new Tool({
        handleMouseDown (e: any) {
            e.preventDefault();
            e.stopPropagation();

            const tool = this.state.tool;

            // save the starting x/y of the rectangle
            tool.mouseState.startX = parseInt(e.clientX, 10);
            tool.mouseState.startY = parseInt(e.clientY, 10) - this.state.top;

            this.state.selected.updateInits(3);

            this.updateInits(0);

            tool.mouseState.down = true;
        },
        handleMouseMove (e: any) {
            e.preventDefault();
            e.stopPropagation();

            const tool = this.state.tool;

            // if we're not dragging, just return
            if (tool.mouseState.down === false) {
                return;
            }

            // get the current mouse position
            tool.mouseState.currentX = parseInt(e.clientX, 10);
            tool.mouseState.currentY = parseInt(e.clientY, 10) - 4;

            // calculate changes and update state
            this.setState((prevState: any) => {

                // change horizontal
                switch (tool.horizontal) {
                    case 1:
                        prevState.selected.state.left = prevState.selected.initLeft + (tool.mouseState.currentX - tool.mouseState.startX);
                        prevState.selected.state.width = prevState.selected.initWidth - (tool.mouseState.currentX - tool.mouseState.startX);
                        if ((tool.mouseState.currentX - tool.mouseState.startX) > prevState.selected.initWidth) {
                            prevState.selected.state.left = prevState.selected.initLeft + prevState.selected.initWidth;
                            prevState.selected.state.width = (tool.mouseState.currentX - tool.mouseState.startX) - prevState.selected.initWidth;
                        }

                        // reposition other sketches to prevent intersection
                        // [consider rewriting this code]
                        if (this.state.selected.id.length === 1) {
                            if (tool.mouseState.currentX - tool.mouseState.startX <= 0) {
                                for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                                    if (prevState.selected.state.left > this.state.sketches.data[i].state.left && prevState.selected.canItersectByHeightWith(this.state.sketches.data[i])) {
                                        this.state.sketches.data[i].state.left = this.state.sketches.data[i].initLeft + (tool.mouseState.currentX - tool.mouseState.startX);
                                    }
                                }
                            } else if ((tool.mouseState.currentX - tool.mouseState.startX) > prevState.selected.initWidth) {
                                for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                                    if (prevState.selected.state.left < this.state.sketches.data[i].state.left && prevState.selected.canItersectByHeightWith(this.state.sketches.data[i])) {
                                        this.state.sketches.data[i].state.left = this.state.sketches.data[i].initLeft + (tool.mouseState.currentX - tool.mouseState.startX) - prevState.selected.initWidth;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        prevState.selected.state.width = prevState.selected.initWidth + (tool.mouseState.currentX - tool.mouseState.startX);
                        if (prevState.selected.state.width < 0) {
                            prevState.selected.state.left = prevState.selected.initLeft + prevState.selected.state.width;
                        }

                        // reposition other sketches to prevent intersection
                        // [consider rewriting this code]
                        if (this.state.selected.id.length === 1) {
                            if (tool.mouseState.currentX - tool.mouseState.startX >= 0) {
                                for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                                    if (prevState.selected.state.left < this.state.sketches.data[i].state.left && prevState.selected.canItersectByHeightWith(this.state.sketches.data[i])) {
                                        this.state.sketches.data[i].state.left = this.state.sketches.data[i].initLeft + (tool.mouseState.currentX - tool.mouseState.startX);
                                    }
                                }
                            } else if (prevState.selected.state.width < 0) {
                                for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                                    if (prevState.selected.state.left > this.state.sketches.data[i].state.left && prevState.selected.canItersectByHeightWith(this.state.sketches.data[i])) {
                                        this.state.sketches.data[i].state.left = this.state.sketches.data[i].initLeft + (tool.mouseState.currentX - tool.mouseState.startX) + prevState.selected.initWidth;
                                    }
                                }
                            }
                        }

                        prevState.selected.state.width = Math.abs(prevState.selected.state.width);
                        break;
                    default:

                        break;
                }

                // change vertical
                switch (tool.vertical) {
                    case 1:
                        prevState.selected.state.top = prevState.selected.initTop + (tool.mouseState.currentY - tool.mouseState.startY);
                        prevState.selected.state.height = prevState.selected.initHeight - (tool.mouseState.currentY - tool.mouseState.startY);

                        if ((tool.mouseState.currentY - tool.mouseState.startY) > prevState.selected.initHeight) {
                            prevState.selected.state.top = prevState.selected.initTop + prevState.selected.initHeight;
                            prevState.selected.state.height = (tool.mouseState.currentY - tool.mouseState.startY) - prevState.selected.initHeight;
                        }

                        // reposition other sketches to prevent intersection
                        // [consider rewriting this code]
                        if (this.state.selected.id.length === 1) {
                            if (tool.mouseState.currentY - tool.mouseState.startY <= 0) {
                                for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                                    if (prevState.selected.state.top > this.state.sketches.data[i].state.top && prevState.selected.canItersectByWidthWith(this.state.sketches.data[i])) {
                                        this.state.sketches.data[i].state.top = this.state.sketches.data[i].initTop + (tool.mouseState.currentY - tool.mouseState.startY);
                                    }
                                }
                            } else if (tool.mouseState.currentY - tool.mouseState.startY > prevState.selected.initHeight) {
                                for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                                    if (prevState.selected.state.top < this.state.sketches.data[i].state.top && prevState.selected.canItersectByWidthWith(this.state.sketches.data[i])) {
                                        this.state.sketches.data[i].state.top = this.state.sketches.data[i].initTop + (tool.mouseState.currentY - tool.mouseState.startY) - prevState.selected.initHeight;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        prevState.selected.state.height = prevState.selected.initHeight + (tool.mouseState.currentY - tool.mouseState.startY);
                        if (prevState.selected.state.height < 0) {
                            prevState.selected.state.top = prevState.selected.initTop + prevState.selected.state.height;
                        }

                        // reposition other sketches to prevent intersection
                        // [consider rewriting this code]
                        if (this.state.selected.id.length === 1) {
                            if (tool.mouseState.currentY - tool.mouseState.startY >= 0) {
                                for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                                    if (prevState.selected.state.top < this.state.sketches.data[i].state.top && prevState.selected.canItersectByWidthWith(this.state.sketches.data[i])) {
                                        this.state.sketches.data[i].state.top = this.state.sketches.data[i].initTop + (tool.mouseState.currentY - tool.mouseState.startY);
                                    }
                                }
                            } else if (prevState.selected.state.height < 0) {
                                for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
                                    if (prevState.selected.state.top > this.state.sketches.data[i].state.top && prevState.selected.canItersectByWidthWith(this.state.sketches.data[i])) {
                                        this.state.sketches.data[i].state.top = this.state.sketches.data[i].initTop + (tool.mouseState.currentY - tool.mouseState.startY) + prevState.selected.initHeight;
                                    }
                                }
                            }
                        }

                        prevState.selected.state.height = Math.abs(prevState.selected.state.height);
                        break;
                    default:

                        break;
                }

                this.state.selected.resizeChildren(this.state.selected.id.length === 1);

                return {
                    selected: prevState.selected
                }

            });
        },
        handleMouseUp (e: any) {
            e.preventDefault();
            e.stopPropagation();

            const tool = this.state.tool;

            // the drag is over, clear the dragging flag
            tool.mouseState.down = false;

            if (document.querySelector('#' + tool.selectorID + ':hover') === null) {
                if (tool.toolRepo === null || tool.mouseState.down === true) {
                    return;
                }
                this.setState({ tool: tool.toolRepo });
                tool.toolRepo = null;
            }
        }
    }),
    bind (component: React.Component) {
        this.Default.bind(component);
        this.DrawSketch.bind(component);
        this.Resize.bind(component);
    }
}

export default toolCollection