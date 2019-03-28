import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import HumbleArray from 'src/datatypes/HumbleArray';
import KeyFrameCollection from 'src/datatypes/KeyFrames/KeyFrameCollection';
import { BoardElement, IBoardElementState } from "../BoardElement";
import { implementsIWindowElementContainerUser } from './WindowElementContainer';

interface IWindowElementState extends IBoardElementState {
    keyFrameCollection: KeyFrameCollection,
    record: boolean,
}

abstract class WindowElement<S extends IWindowElementState> extends BoardElement<S> {

    public refine(): void {
        super.refine();
        this.state.keyFrameCollection.init();
    }

    public requestKeyFrameCreation(): void {
        if (this.state.record === true) {
            this.state.keyFrameCollection.mapCurrentFrame();
        }
        if (implementsIWindowElementContainerUser(this)) {
            for(const child of this.state.boardElements) {
                if (child instanceof WindowElement === false) {
                    throw new EvalError("Every children of a WindowElement should be a WindowElement as well.");
                }
                (child as WindowElement<IWindowElementState>).requestKeyFrameCreation();
            }
        }
    }

    protected getTabLevel(level: number): string {
        let result = '';
        for (let i = 0; i < level; ++i) {
            result += '\t';
        }
        return result;
    }

    // refactor this mess
    protected renderSelectors(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        let result = '';
        result += this.renderId(localStyleDecleration, globalStyleDecleration);
        if (result !== '') {
            result += ' ';
        }
        result += this.renderClasses(localStyleDecleration, globalStyleDecleration);
        return result;
    }

    protected getInitialState(id: string = this.id, boardElements: HumbleArray = new HumbleArray()): S {
        const state = super.getInitialState(id, boardElements);
        state.keyFrameCollection = new KeyFrameCollection(this, id);
        state.record = true;
        return state as S;
    }

    private renderId(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        let result = '';
        const localId = localStyleDecleration.getSubjectsId(this);
        const globalId = globalStyleDecleration.getSubjectsId(this);
        // Frage kann eine Id in der Global und Local stehen?
        if (globalId === null) {
            if (localId !== null) {
                result += 'id = "' + localId.getSelectorName() + '"';
            }
        } else if (localId === null) {
            result += 'id = "' + globalId.getSelectorName() + '"';
        } else {
            throw EvalError(`
            There is a subject with an id in the local and global styleDecleration. 
            The is unexpected Behaviour. 
            Please think about how to prevent this or which one to pick.`
            );
        }
        return result;
    }

    private renderClasses(localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        let result = '';
        const classes = globalStyleDecleration.getSubjectsClasses(this).concat(localStyleDecleration.getSubjectsClasses(this));
        if (classes.length !== 0) {
            result += 'class = "';
            for (let i = 0, len = classes.length; i < len; ++i) {
                const localClass = classes[i];
                result += localClass.getSelectorName();
                if (i + 1 < len) {
                    result += ' ';
                }
            }
            result += '"';
        }
        return result;
    }

}

export {
    IWindowElementState,
    WindowElement,
}