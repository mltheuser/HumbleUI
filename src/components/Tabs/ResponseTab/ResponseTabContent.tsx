import * as React from 'react';
import { BoardElement, IBoardElementState } from '../../Board/BoardElement';
import { IWindowElementState, WindowElement } from '../../Board/BoardElements/WindowElement';
import { SketchBoard } from '../../Board/SketchBoard';
import DefaultTabContent from '../DefaultTabContent';
import ResponseOverview from './Items/Overview';
import RecordSection from './Items/RecordSection';

interface ISelectedWindowElementProps {
    selectedWindowElement: WindowElement<IWindowElementState>
}

class ResponseTabContent extends DefaultTabContent {

    public constructor() {
        super();
    }

    public render() {
        const selectedBoardElement = SketchBoard.getInstance().state.selectedBoardElement;
        this.isWindowElementValidation(selectedBoardElement);
        return (
            <div className="tabContent">
                <RecordSection selectedWindowElement={(selectedBoardElement as WindowElement<IWindowElementState>)}/>
                <ResponseOverview selectedWindowElement={(selectedBoardElement as WindowElement<IWindowElementState>)}/>
            </div>
        );
    }

    private isWindowElementValidation(selectedBoardElement: BoardElement<IBoardElementState> | null) {
        if (selectedBoardElement instanceof WindowElement === false) {
            throw new EvalError("The ResponseTab should only be displayed for WindowElements.")
        }
    }

}

export {
    ISelectedWindowElementProps,
    ResponseTabContent,
};