import { Checkbox } from '@material-ui/core';
import * as React from 'react';
import { ChromePicker } from 'react-color';
import { ISketchBoardState, SketchBoard } from './Board/SketchBoard';
import DefaultTabContent from './DefaultTabContent';
import LineSelect from './LineSelect';
import NumberField from './NumberField';

class AppearanceTabContent extends DefaultTabContent {

    public constructor() {
        super();
        this.handleBorderChange = this.handleBorderChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(SketchBoard.getInstance());
    }

    public render() {
        const selectedBoardElement = SketchBoard.getInstance().state.selectedBoardElement;
        if (selectedBoardElement === null) {
            throw EvalError("AppearanceTab should not be displayed when ")
        }
        return (
            <div className="tabContent">
                <div className="infoItem" id="positioning" />
                <div className="infoItem" id="appearance">
                    <div className="header">
                        <h3>APPEARANCE</h3>
                    </div>
                    <div id="colorPicker" className="infoPaper">
                        <div className="borderControll">
                            <Checkbox checked={selectedBoardElement.state.displayProperties.borderIsChecked()} color="default" value="borderChecked" onChange={this.handleBorderChange} />
                            <div className="borderColor" />
                            <p>Border</p>
                            <div className="picker">
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path fill="rgba(0, 0, 0, 0.54)" d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z" />
                                </svg>
                            </div>
                            <div className="borderWidth">
                                <NumberField />
                            </div>
                            <div className="lineStyle">
                                <LineSelect />
                            </div>
                        </div>
                        <ChromePicker color={selectedBoardElement.state.displayProperties["background-color"].getValue()} onChange={this.handleColorChange} />
                    </div>
                </div>
            </div>
        );
    }
        
    private handleColorChange(color: any) {
        this.setState((prevState: ISketchBoardState) => {
            if (prevState.selectedBoardElement === null) {
                throw EvalError("Trying to change color on an element, that is not selected.")
            }
            prevState.selectedBoardElement.state.displayProperties["background-color"].setValue(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
            return {
                selectedBoardElement: prevState.selectedBoardElement
            }
        });
    }
            
    private handleBorderChange(event: any) {
        const checked = event.target.checked;
        SketchBoard.getInstance().setState((prevState: ISketchBoardState) => {
            const selectedBoardElement = prevState.selectedBoardElement;
            if (selectedBoardElement === null) {
                throw EvalError("selected is null.");
            }
            if ("border-style" in selectedBoardElement.state.displayProperties) {
                if (checked) {
                    selectedBoardElement.state.displayProperties["border-style"].setValue("solid");
                } else {
                    selectedBoardElement.state.displayProperties["border-style"].setValue("none");
                }
            }
            return {
                selectedBoardElement,
            }
        });

        this.setState({});
    }
}

export default AppearanceTabContent;