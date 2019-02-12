import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import { BoardElement, IBoardElementState } from "../BoardElement";

abstract class WindowElement<S extends IBoardElementState> extends BoardElement<S> {

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
    WindowElement,
}