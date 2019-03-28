import { FormControlLabel, Switch } from '@material-ui/core';
import * as React from 'react';
import { BoardElement, IBoardElementState } from './Board/BoardElement';
import { IWindowElementState, WindowElement } from './Board/BoardElements/WindowElement';
import { SketchBoard } from './Board/SketchBoard';
import DefaultTabContent from './DefaultTabContent';

class ResponseTabContent extends DefaultTabContent {

    public constructor() {
        super();
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    public render() {
        const selectedBoardElement = SketchBoard.getInstance().state.selectedBoardElement;
        this.isWindowElementValidation(selectedBoardElement);
        return (
            <div className="tabContent">
                <div className="infoItem" id="record">
                    <div id="recSelect">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={(selectedBoardElement as WindowElement<IWindowElementState>).state.record}
                                    onChange={this.handleSwitchChange}
                                    value="checkedA"
                                />
                            }
                            label="rec"
                        />
                    </div>
                </div>
                <div className="infoItem" id="keyOverview">
                    <div className="header">
                        <h3>OVERVIEW</h3>
                    </div>
                    <div className="infoPaper responseWindow">
                        <div
                            style= {{
                                background: '#4681b3',
                                height: '130px',
                                margin: '0px auto',
                                width: '90%',
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private handleSwitchChange(event: any) {
        const selectedBoardElement = SketchBoard.getInstance().state.selectedBoardElement;
        this.isWindowElementValidation(selectedBoardElement);
        (selectedBoardElement as WindowElement<IWindowElementState>).state.record = event.target.checked;
        SketchBoard.getInstance().setState({});
        this.setState({});
    }

    private isWindowElementValidation(selectedBoardElement: BoardElement<IBoardElementState> | null) {
        if (selectedBoardElement instanceof WindowElement === false) {
            throw new EvalError("The ResponseTab should only be displayed for WindowElements.")
        }
    }

}

export default ResponseTabContent;