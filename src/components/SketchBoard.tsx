import * as React from 'react';
import { IAppProps, ICoordiante, IElementState, ISketchBoardState} from 'src/datatypes/interfaces';
import toolCollection from '../data/ToolCollection';
import HumbleArray from '../datatypes/HumbleArray';
import Element from './Element';
import Selector from './Selector';
import Sketch from './Sketch';
import WindowSketch from './WindowSketch';

class SketchBoard extends React.Component<IAppProps, any> {

    public name: string = 'sketchBoard';

    public state: ISketchBoardState = {
        left: 0,
        selected: null,
        sketches: new HumbleArray(),
        tool: toolCollection.Default,
        top: 64,
        zoom: 1,
    };

    public constructor(props: IAppProps) {
        super(props);
        this.props.app.sketchBoard = this;
        toolCollection.bind(this);
    }

    public updateInits(mode = 2) {
        for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
            this.state.sketches.data[i].updateInits(mode);
        }
    }

    public getOffset(mode: number) {
        if(mode === 0) {
            return this.state.left;
        }
        return this.state.top;
    }

    public calculateSketchOffset(id: string, offset: number, searchSpace: SketchBoard | Sketch = this, sum = 0): number {
        return id.length === 0 ? sum + searchSpace.getOffset(offset) : this.calculateSketchOffset(id.substring(1), offset, searchSpace.state.sketches.data[id.charAt(0)], sum + searchSpace.getOffset(offset));
    }

    public getSketchOffset(id: string) : ICoordiante {
        return {x: this.calculateSketchOffset(id, 0), y: this.calculateSketchOffset(id, 1)};
    }

    public findElementById(searchSpace: any = this, id: string = ''): Element<IElementState> {
        if (id.length === 1) {
            return searchSpace.state.sketches.data[id];
        }
        return this.findElementById(searchSpace.state.sketches.data[id.charAt(0)], id.substring(1));
    }

    public findAndSelectElementByTargetId(id: string): Element<IElementState> {
        if (id.length === 0 || /^\d+$/.test(id) === false) {
            throw ReferenceError("Invalid id.");
        }
        let i = 0;
        if (this.state.selected) {
            const len = id.length;
            const len2 = (this.state.selected === null ? 0 : this.state.selected.id.length);
            for (; i < len; ++i) {
                if (i === len2 || id.charAt(i) !== this.state.selected.id.charAt(i)) {
                    break;
                }
            }
        }
        const element = this.findElementById(this, id.substring(0, i + 1));
        element.state.selected = true;
        return element;
    }

    public updateSelection(element: Element<IElementState>) {
        if (element !== null) {
            if (!(element.constructor instanceof Element.constructor)) {
                throw TypeError(`Expected element to be instance of Element, ${element.constructor.name} given.`);
            }
            element = this.findAndSelectElementByTargetId(element.id);
        }
        if (element === this.state.selected) {
            return;
        }
        this.setState((prevState: any) => {
            if (prevState.selected !== null) {
                prevState.selected.state.selected = false;
            }
            return {
                selected: element,
            }
        });
        this.props.app.setState({});
    }

    public componentDidMount() {
        window.addEventListener('wheel', this.handleScroll.bind(this), { passive: true } as EventListenerOptions);
    }

    public componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll.bind(this), { passive: true } as EventListenerOptions);
    }

    public handleScroll(event: any) {
        if (event.shiftKey) {
            const scrollTargetId = event.target.id[0];
            if(scrollTargetId !== undefined) {
                const scrollTarget = this.findElementById(this, scrollTargetId);
                if (scrollTarget instanceof WindowSketch) {
                    scrollTarget.handleScroll(event);
                    this.setState({});
                }
            }
        } else {
            this.handleSketchBoardScroll(event);
        }
    }

    public render() {
        const inline = {
            cursor: this.state.tool.cursor
        }
        return (
            <main id="main" style={inline} onMouseDown={this.state.tool.handleMouseDown} onMouseMove={this.state.tool.handleMouseMove} onMouseUp={this.state.tool.handleMouseUp}>
                {this.state.sketches.render()}
                <Selector sketchBoard={this} />
            </main>
        );
    }

    private getCenter() {
        const main = document.getElementById('main');
        const toolpalate = document.getElementById('tool-palate');
        const info = document.getElementById('info');
        if (toolpalate && toolpalate.offsetWidth && main && info) {
            return {
                x: toolpalate.offsetWidth + (main.offsetWidth - info.offsetWidth - toolpalate.offsetWidth) / 2,
                y: main.offsetHeight / 2
            };
        }
        throw Error("getCenter failed.");
    }

    private zoomDomainElements(domain: any, newZoom: number, repositionVector = { x: 0, y: 0 }) {
        for (let i = 0, len = domain.state.sketches.data.length; i < len; ++i) {
            const tmp = domain.state.sketches.data[i];
            tmp.state.top = (tmp.state.top / this.state.zoom) * newZoom + repositionVector.y;
            tmp.state.left = (tmp.state.left / this.state.zoom) * newZoom + repositionVector.x;
            tmp.state.height = (tmp.state.height / this.state.zoom) * newZoom;
            tmp.state.width = (tmp.state.width / this.state.zoom) * newZoom;
            tmp.updateSketchOffset();
            this.zoomDomainElements(tmp, newZoom);
        }
    }

    private handleSketchBoardScroll(event: any) {
        const center = this.getCenter();
        const newZoom = this.state.zoom + event.deltaY / 1600;
        const newCursor = {
            x: event.clientX / this.state.zoom * newZoom,
            y: (event.clientY - this.state.top) / this.state.zoom * newZoom,
        };
        const dist = {
            x: center.x - newCursor.x,
            y: center.y - newCursor.y,
        };
        this.zoomDomainElements(this, newZoom, dist);
        this.setState({ zoom: newZoom });
    }
}

export default SketchBoard;