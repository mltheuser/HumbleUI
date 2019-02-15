import { IWindowState, Window } from 'src/components/Board/BoardElements/Window';
import { Div, IDivState } from 'src/components/Board/BoardElements/WindowElements/Div';
import { ISketchBoardState } from 'src/components/Board/SketchBoard';
import Tool from 'src/components/Tool';
import DisplayPropertyCollection from 'src/datatypes/DisplayProperties/DisplayPropertyCollection';

const toolCollection = {
    Default: new Tool(
        {
            cursor: 'default',
            handleMouseDown(e: any) {
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
            handleMouseMove(e: any) {
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
                        sketch.move(sketch.initLeft + updateX, sketch.initTop + updateY)
                    }
                } else {
                    this.state.selected.move(this.state.selected.initLeft + updateX, this.state.selected.initTop + updateY)
                }
                this.setState({});
            },
            handleMouseUp(e: any) {
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
            handleMouseDown(e: any) {
                let tmp: Window<IWindowState> | Div<IDivState>;
                const tool = this.state.tool;
                if (e.target.tagName === 'MAIN') {
                    // calculate the sketches offset
                    const offset = this.calculateOffsetById('');
                    toolCollection.DrawSketch.offsetLeft = offset.x;
                    toolCollection.DrawSketch.offsetTop = offset.y;

                    // save the starting x/y of the rectangle
                    tool.mouseState.startX = parseInt(e.clientX, 10) - tool.offsetLeft;
                    tool.mouseState.startY = parseInt(e.clientY, 10) - tool.offsetTop;

                    // add the Sketch to the sketchBoard
                    tmp = new Window(String(this.state.sketches.data.length), this);
                    this.state.sketches.push(tmp);
                } else {
                    // first of, find the Sketch that gets a new Component
                    const parentId = e.target.getAttribute("id");
                    const parent = this.findElementById(this, parentId);

                    // calculate the sketches offset
                    const offset = this.calculateOffsetById(parentId);
                    toolCollection.DrawSketch.offsetLeft = offset.x;
                    toolCollection.DrawSketch.offsetTop = offset.y;

                    // save the starting x/y of the rectangle
                    tool.mouseState.startX = parseInt(e.clientX, 10) - tool.offsetLeft;
                    tool.mouseState.startY = parseInt(e.clientY, 10) - tool.offsetTop;

                    // create the new Div with an id of parentId followed by its future position in the parents sketch array
                    tmp = new Div(String(parentId) + parent.state.sketches.data.length, this);

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
            handleMouseMove(e: any) {
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
                this.setState((prevState: ISketchBoardState) => {
                    if (prevState.selectedBoardElement === null) {
                        throw EvalError("selected is null.");
                    }
                    prevState.selectedBoardElement.state.displayProperties.width.setValue(Math.abs(tool.mouseState.currentX - tool.mouseState.startX));
                    prevState.selectedBoardElement.state.displayProperties.height.setValue(Math.abs(tool.mouseState.currentY - tool.mouseState.startY));
                    if (tool.mouseState.currentY < tool.mouseState.startY) {
                        prevState.selectedBoardElement.state.displayProperties.top.setValue(prevState.selectedBoardElement.getInitValues().top + tool.mouseState.currentY - tool.mouseState.startY);
                    }
                    if (tool.mouseState.currentX < tool.mouseState.startX) {
                        prevState.selectedBoardElement.state.displayProperties.left.setValue(prevState.selectedBoardElement.getInitValues().left + tool.mouseState.currentX - tool.mouseState.startX);
                    }
                    return {
                        selectedBoardElement: prevState.selectedBoardElement
                    }
                });
            },
            handleMouseUp(e: any) {
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
        handleMouseDown(e: any) {
            const tool = this.state.tool;

            // save the starting x/y of the rectangle
            tool.mouseState.startX = parseInt(e.clientX, 10);
            tool.mouseState.startY = parseInt(e.clientY, 10) - this.state.top;

            this.state.selected.updateInits(3);

            this.updateInits(0);

            this.state.selected.state.refined = false;
            tool.mouseState.down = true;
        },
        handleMouseMove(e: any) {
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

            // calculate changes and update state
            this.setState((prevState: ISketchBoardState) => {
                if (prevState.selectedBoardElement === null) {
                    throw EvalError("Trying to resize a not selected Element.");
                }
                const displayProperties: DisplayPropertyCollection = prevState.selectedBoardElement.state.displayProperties;
                const initValues = prevState.selectedBoardElement.getInitValues();
                // change horizontal
                switch (tool.horizontal) {
                    case 1:
                        displayProperties.left.setValue(initValues.left + (tool.mouseState.currentX - tool.mouseState.startX));
                        displayProperties.width.setValue(initValues.width - (tool.mouseState.currentX - tool.mouseState.startX));
                        if ((tool.mouseState.currentX - tool.mouseState.startX) > initValues.width) {
                            displayProperties.left.setValue(initValues.left + initValues.width);
                            displayProperties.width.setValue((tool.mouseState.currentX - tool.mouseState.startX) - initValues.width);
                        }

                        // reposition other sketches to prevent intersection
                        // [consider rewriting this code]
                        if (prevState.selectedBoardElement instanceof Window) {
                            if (tool.mouseState.currentX - tool.mouseState.startX <= 0) {
                                for (const child of prevState.selectedBoardElement.state.WindowElements) {
                                    if (displayProperties.left.getValue() > child.state.displayProperties.left.getValue() && prevState.selectedBoardElement.canItersectByHeightWith(child)) {
                                        const childInitValues = child.getInitValues();
                                        child.state.displayProperties.left.setValue(childInitValues.left + (tool.mouseState.currentX - tool.mouseState.startX));
                                    }
                                }
                            } else if ((tool.mouseState.currentX - tool.mouseState.startX) > initValues.width) {
                                for (const child of prevState.selectedBoardElement.state.WindowElements) {
                                    if (displayProperties.left.getValue() < child.state.displayProperties.left.getValue() && prevState.selectedBoardElement.canItersectByHeightWith(child)) {
                                        const childInitValues = child.getInitValues();
                                        child.state.displayProperties.left.setValue(childInitValues.left + (tool.mouseState.currentX - tool.mouseState.startX) - initValues.width);
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        displayProperties.width.setValue(initValues.width + (tool.mouseState.currentX - tool.mouseState.startX));
                        if (displayProperties.width.getValue() < 0) {
                            displayProperties.left.setValue(initValues.left + displayProperties.width.getValue());
                        }

                        // reposition other sketches to prevent intersection
                        // [consider rewriting this code]
                        if (prevState.selectedBoardElement instanceof Window) {
                            if (tool.mouseState.currentX - tool.mouseState.startX >= 0) {
                                for (const child of prevState.selectedBoardElement.state.WindowElements) {
                                    if (displayProperties.left.getValue() < child.state.displayProperties.left.getValue() && prevState.selectedBoardElement.canItersectByHeightWith(child)) {
                                        const childInitValues = child.getInitValues();
                                        child.state.displayProperties.left.setValue(childInitValues.left + (tool.mouseState.currentX - tool.mouseState.startX));
                                    }
                                }
                            } else if (displayProperties.width.getValue() < 0) {
                                for (const child of prevState.selectedBoardElement.state.WindowElements) {
                                    if (displayProperties.left.getValue() > child.state.displayProperties.left.getValue() && prevState.selectedBoardElement.canItersectByHeightWith(child)) {
                                        const childInitValues = child.getInitValues();
                                        child.state.displayProperties.left.setValue(childInitValues.left + (tool.mouseState.currentX - tool.mouseState.startX) + initValues.width);
                                    }
                                }
                            }
                        }
                        displayProperties.width.setValue(Math.abs(displayProperties.width.getValue()));
                        break;
                    default:

                        break;
                }

                // change vertical
                switch (tool.vertical) {
                    case 1:
                        displayProperties.top.setValue(initValues.top + (tool.mouseState.currentY - tool.mouseState.startY));
                        displayProperties.height.setValue(initValues.height - (tool.mouseState.currentY - tool.mouseState.startY));

                        if ((tool.mouseState.currentY - tool.mouseState.startY) > initValues.height) {
                            displayProperties.top.setValue(initValues.top + initValues.height);
                            displayProperties.height.setValue((tool.mouseState.currentY - tool.mouseState.startY) - initValues.height);
                        }

                        // reposition other sketches to prevent intersection
                        // [consider rewriting this code]
                        if (prevState.selectedBoardElement instanceof Window) {
                            if (tool.mouseState.currentY - tool.mouseState.startY <= 0) {
                                for (const child of prevState.selectedBoardElement.state.WindowElements) {
                                    if (displayProperties.top.getValue() > child.state.displayProperties.top.getValue() && prevState.selectedBoardElement.canItersectByWidthWith(child)) {
                                        const childInitValues = child.getInitValues();
                                        child.state.displayProperties.top.setValue(childInitValues.top + (tool.mouseState.currentY - tool.mouseState.startY));
                                    }
                                }
                            } else if (tool.mouseState.currentY - tool.mouseState.startY > initValues.height) {
                                for (const child of prevState.selectedBoardElement.state.WindowElements) {
                                    if (displayProperties.top.getValue() < child.state.displayProperties.top.getValue() && prevState.selectedBoardElement.canItersectByWidthWith(child)) {
                                        const childInitValues = child.getInitValues();
                                        child.state.displayProperties.top.setValue(childInitValues.top + (tool.mouseState.currentY - tool.mouseState.startY) - initValues.height);
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        displayProperties.height.setValue(initValues.height + (tool.mouseState.currentY - tool.mouseState.startY));
                        if (displayProperties.height.getValue() < 0) {
                            displayProperties.top.setValue(initValues.top + displayProperties.height.getValue());
                        }

                        // reposition other sketches to prevent intersection
                        // [consider rewriting this code]
                        if (prevState.selectedBoardElement instanceof Window) {
                            if (tool.mouseState.currentY - tool.mouseState.startY >= 0) {
                                for (const child of prevState.selectedBoardElement.state.WindowElements) {
                                    if (displayProperties.top.getValue() < child.state.displayProperties.top.getValue() && prevState.selectedBoardElement.canItersectByWidthWith(child)) {
                                        const childInitValues = child.getInitValues();
                                        child.state.displayProperties.top.setValue(childInitValues.top + (tool.mouseState.currentY - tool.mouseState.startY));
                                    }
                                }
                            } else if (displayProperties.height.getValue() < 0) {
                                for (const child of prevState.selectedBoardElement.state.WindowElements) {
                                    if (displayProperties.top.getValue() > child.state.displayProperties.top.getValue() && prevState.selectedBoardElement.canItersectByWidthWith(child)) {
                                        const childInitValues = child.getInitValues();
                                        child.state.displayProperties.top.setValue(childInitValues.top + (tool.mouseState.currentY - tool.mouseState.startY) + initValues.height);
                                    }
                                }
                            }
                        }

                        displayProperties.height.setValue(Math.abs(displayProperties.height.getValue()));
                        break;
                    default:

                        break;
                }

                this.state.selected.resizeChildren(this.state.selected.id.length === 1);

                return {
                    selectedBoardElement: prevState.selectedBoardElement
                }

            });
        },
        handleMouseUp(e: any) {
            e.preventDefault();
            e.stopPropagation();

            const tool = this.state.tool;

            this.state.selected.state.refined = true;
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
    SelectBorderRadius: new Tool({
        handleMouseDown(e: any) {
            const tool = this.state.tool;

            const displayProperties: DisplayPropertyCollection = this.state.selected.state.displayProperties;

            // save initBorderRadius
            tool.initBorderRadius = {
                bottomLeft: displayProperties["border-bottom-left-radius"].getValue(),
                bottomRight: displayProperties["border-bottom-right-radius"].getValue(),
                topLeft: displayProperties["border-top-left-radius"].getValue(),
                topRight: displayProperties["border-top-right-radius"].getValue(),
            };

            // save the starting x/y of the rectangle
            tool.mouseState.startX = parseInt(e.clientX, 10);
            tool.mouseState.startY = parseInt(e.clientY, 10) - this.state.top;

            this.state.selected.state.refined = false;
            tool.mouseState.down = true;
        },
        handleMouseMove(e: any) {
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

            // calculate changes and update state
            this.setState((prevState: ISketchBoardState) => {
                const selectedBoardElement = prevState.selectedBoardElement;
                if (selectedBoardElement === null || !(selectedBoardElement instanceof Div)) {
                    return;
                }

                const updates = new Array(2);
                switch (tool.selectorID) {
                    case 'topLeftRadius':
                        updates[0] = tool.mouseState.currentX - tool.mouseState.startX;
                        updates[1] = tool.mouseState.currentY - tool.mouseState.startY;
                        break;
                    case 'topRightRadius':
                        updates[0] = tool.mouseState.startX - tool.mouseState.currentX;
                        updates[1] = tool.mouseState.currentY - tool.mouseState.startY;
                        break;
                    case 'bottomLeftRadius':
                        updates[0] = tool.mouseState.currentX - tool.mouseState.startX;
                        updates[1] = tool.mouseState.startY - tool.mouseState.currentY;
                        break;
                    case 'bottomRightRadius':
                        updates[0] = tool.mouseState.startX - tool.mouseState.currentX;
                        updates[1] = tool.mouseState.startY - tool.mouseState.currentY;
                        break;
                }

                const update = Math.max(...updates);

                selectedBoardElement.state.displayProperties["border-top-left-radius"].setValue(tool.initBorderRadius.topLeft + update);
                selectedBoardElement.state.displayProperties["border-top-right-radius"].setValue(tool.initBorderRadius.topRight + update);
                selectedBoardElement.state.displayProperties["border-bottom-left-radius"].setValue(tool.initBorderRadius.bottomLeft + update);
                selectedBoardElement.state.displayProperties["border-bottom-right-radius"].setValue(tool.initBorderRadius.bottomRight + update);

                return {
                    selectedBoardElement: prevState.selectedBoardElement
                }
            });
        },
        handleMouseUp(e: any) {
            e.preventDefault();
            e.stopPropagation();

            const tool = this.state.tool;

            this.state.selected.state.refined = true;
            tool.mouseState.down = false;

            this.setState({ selected: this.state.selected });

            if (document.querySelector('#' + tool.selectorID + ':hover') === null) {
                if (tool.toolRepo === null || tool.mouseState.down === true) {
                    return;
                }
                this.setState({ tool: tool.toolRepo });
                tool.toolRepo = null;
            }
        },
    }),

    bind(component: React.Component) {
        this.Default.bind(component);
        this.DrawSketch.bind(component);
        this.Resize.bind(component);
        this.SelectBorderRadius.bind(component);
    }
}

export default toolCollection