import { Checkbox } from '@material-ui/core';
import * as React from 'react';
import { ChromePicker } from 'react-color';
import { IAppProps, ISketchBoardState } from 'src/datatypes/interfaces';
import Sketch from './Board/Elements/Sketch';
import DefaultTabContent from './DefaultTabContent';
import LineSelect from './LineSelect';
import NumberField from './NumberField';

class AppearanceTabContent extends DefaultTabContent {

    public constructor(props: IAppProps) {
        super(props);
        this.handleBorderChange = this.handleBorderChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this.sketchBoard);
    }

    public render() {
        return (
            <div className="tabContent">
                <div className="infoItem" id="positioning" />
                <div className="infoItem" id="appearance">
                    <div className="header">
                        <h3>APPEARANCE</h3>
                    </div>
                    <div id="colorPicker" className="infoPaper">
                        <div className="borderControll">
                            <Checkbox checked={this.sketchBoard.state.selected.state.borderChecked} color="default" value="borderChecked" onChange={this.handleBorderChange} />
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
                        <ChromePicker color={this.sketchBoard.state.selected.state.color} onChange={this.handleColorChange} />
                    </div>
                </div>
            </div>
        );
    }
        
    private handleColorChange(color: any) {
        this.setState((prevState: ISketchBoardState) => {
            if (prevState.selected === null) {
                throw EvalError("Trying to change color on an element, that is not selected.")
            }
            prevState.selected.state.displayProperties["background-color"].setValue(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
            return {
                selected: prevState.selected
            }
        });
    }
            
    private handleBorderChange(event: any) {
        const checked = event.target.checked;
        this.sketchBoard.setState((prevState: ISketchBoardState) => {
            if (prevState.selected === null) {
                throw EvalError("selected is null.");
            }
            if (prevState.selected instanceof Sketch) {
                prevState.selected.state.borderChecked = checked;
            }
            return {
                selected: prevState.selected
            }
        });

        this.setState({});
    }
}

export default AppearanceTabContent;