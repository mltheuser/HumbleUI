import Info from 'src/components/Info';
import { BoardElement, IBoardElementState } from '../BoardElement';
import { IWindowElementState, WindowElement } from '../BoardElements/WindowElement';
import { SketchBoard } from '../SketchBoard';
import { Selector } from "./Selector";

class WindowSelector extends Selector {

    protected getSelectedBoardElement(): BoardElement<IBoardElementState> | null {
        const selectedBoardElement = SketchBoard.getInstance().state.selectedBoardElement;
        if (selectedBoardElement === null || selectedBoardElement instanceof WindowElement === false) {
            return null;
        }
        const info = Info.getInstance();
        if (info.state.value !== 1) {
            return null;
        }
        const window = (selectedBoardElement as WindowElement<IWindowElementState>).getWindow();
        return window;
    }

    protected getBorderColor(): string {
        return 'rgb(208, 208, 208)';
    }

    protected getRulerBackgroundColor(): string {
        return 'rgb(208, 208, 208)';
    }

    protected getSelectorColor(): string {
        return 'rgb(208, 208, 208)';
    }

}

export default WindowSelector;