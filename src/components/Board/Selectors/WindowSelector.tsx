import Info from 'src/components/Info';
import { IWindowElementState, WindowElement } from '../BoardElements/WindowElement';
import { SketchBoard } from '../SketchBoard';
import { Selector } from "./Selector";

class WindowSelector extends Selector {

    public render(selectedBoardElement = SketchBoard.getInstance().state.selectedBoardElement) {
        if (selectedBoardElement === null || selectedBoardElement instanceof WindowElement === false) {
            return null;
        }
        const info = Info.getInstance();
        if (info.state.value !== 1) {
            return null;
        }
        const window = (selectedBoardElement as WindowElement<IWindowElementState>).getWindow();
        return super.render(window);
    }

}

export default WindowSelector;