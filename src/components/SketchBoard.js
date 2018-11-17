import React, { Component } from 'react';
import HumbleArray from '../datatypes/HumbleArray'
import toolCollection from '../data/ToolCollection';
import App from '../App';

class SketchBoard extends Component {
    /**
     * Constructs a new instance of Sketchboard and assigns the app referenced in the props a reference to it.
     * 
     * @param {Object} props An object containing a reference to the app object. 
     * @throws {ReferenceError} If props.app is undefined or does not reference an app.
     */
    constructor(props) {
        super();
        if (!(props.app && props.app instanceof App)) {
            throw ReferenceError("Props does not contain a proper referenze to the app object. Make sure you construct as follows: <SketchBoard app={appReferenze}/>.");
        }
        props.app.sketchBoard = this;
        this.state = {
            left: 0,
            selected: null,
            sketches: new HumbleArray(),
            tool: toolCollection.Default,
            top: 4,
            zoom: 1,
        }
    }

    updateInits(mode = 2) {
        for (let i = 0, len = this.state.sketches.data.length; i < len; ++i) {
            this.state.sketches.data[i].updateInits(mode);
        }
    }

    getSketchOffset(id, offset, searchSpace = this, sum = 0) {
        return id.length === 0 ? sum + searchSpace.state[offset] : this.getSketchOffset(id.substring(1), offset, searchSpace.state.sketches.data[id.charAt(0)], sum + searchSpace.state[offset]);
    }

    findElementById(searchSpace, id) {
        if (id.length === 1) {
            return searchSpace.state.sketches.data[id];
        }
        return this.findElementById(searchSpace.state.sketches.data[id.charAt(0)], id.substring(1));
    }

    /**
     * Returns and selects the next element going from selected to target through the hierarchy.
     * 
     * @param {String} id The targets id.
     * @returns {Element} 
     * @throws {ReferenceError} If id is not a String with length greater 0 or there is a symbol that is not in {0-9}.
     */
    findAndSelectElementByTargetId(id) {
        if (typeof id !== "string" || id.length === 0 || /^\d+$/.test(id) === false) {
            throw ReferenceError("Invalid id.");
        }
        let i = 0;
        const len = id.length;
        const len2 = (this.state.selected === null ? 0 : this.state.selected.id.length);
        for (; i < len; ++i) {
            if (i === len2 || id.charAt(i) !== this.state.selected.id.charAt(i)) {
                break;
            }
        }
        const element = this.findElementById(this, id.substring(0, i + 1));
        element.state.selected = true;
        return element;
    }

    /**
     * Changes the selection to the next element going from selected to target through the hierarchy.
     * 
     * @param {Element} element The clicked target element.
     * @throws {TypeError} If element is not instance of Element.
     */
    updateSelection(element) {
        if (element !== null) {
            if (!(element.constructor instanceof Element.constructor)) {
                throw TypeError(`Expected element to be instance of Element, ${element.constructor.name} given.`);
            }
            element = this.findAndSelectElementByTargetId(element.id);
        }
        if (element === this.state.selected) {
            return;
        }
        this.setState((prevState) => {
            if (prevState.selected !== null) {
                prevState.selected.state.selected = false;
            }
            return {
                selected: element,
            }
        });
        this.props.app.setState({});
    }

    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll.bind(this), { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll.bind(this), { passive: true });
    }

    /**
     * Returns the center of the sketchboard.
     * 
     * @returns An Object specifing the center of the sketchboard.
     */
    getCenter() {
        const main = document.getElementById('main');
        const toolpalate = document.getElementById('tool-palate');
        const info = document.getElementById('info');
        return {
            x: toolpalate.offsetWidth + (main.offsetWidth - info.offsetWidth - toolpalate.offsetWidth) / 2,
            y: main.offsetHeight / 2
        };
    }

    // [think about what type domain is. Also have a look at findElementByid]
    zoomDomainElements(domain, newZoom, repositionVector = { x: 0, y: 0 }) {
        for (let i = 0, len = domain.state.sketches.data.length; i < len; ++i) {
            const tmp = domain.state.sketches.data[i];
            tmp.state.top = (tmp.state.top / this.state.zoom) * newZoom + repositionVector.y;
            tmp.state.left = (tmp.state.left / this.state.zoom) * newZoom + repositionVector.x;
            tmp.state.height = (tmp.state.height / this.state.zoom) * newZoom;
            tmp.state.width = (tmp.state.width / this.state.zoom) * newZoom;
            this.zoomDomainElements(tmp, newZoom);
        }
    }

    /**
     * Handles the scroll event by calculating the new zoom and appling i.
     * 
     * @param {*} e The scroll event object.
     */
    handleScroll(e) {
        const center = this.getCenter();
        const newZoom = this.state.zoom + e.deltaY / 400;
        const newCursor = {
            x: e.clientX / this.state.zoom * newZoom,
            y: (e.clientY - this.state.top) / this.state.zoom * newZoom,
        };
        const dist = {
            x: center.x - newCursor.x,
            y: center.y - newCursor.y,
        };
        this.zoomDomainElements(this, newZoom, dist);
        this.setState({ zoom: newZoom });
    }

    render() {
        const inline = {
            cursor: this.state.tool.cursor
        }
        return (
            <main id="main" style={inline} onMouseDown={this.state.tool.handleMouseDown.bind(this)} onMouseMove={this.state.tool.handleMouseMove.bind(this)} onMouseUp={this.state.tool.handleMouseUp.bind(this)}>
                {this.state.sketches.render()}
            </main>
        );
    }
}

export default SketchBoard;