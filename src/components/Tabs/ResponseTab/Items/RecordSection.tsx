import { FormControlLabel, Switch } from '@material-ui/core';
import * as React from 'react';
import { SketchBoard } from 'src/components/Board/SketchBoard';
import { ISelectedWindowElementProps } from '../ResponseTabContent';

class RecordSection extends React.Component<ISelectedWindowElementProps, any> {

    public constructor(props: ISelectedWindowElementProps) {
        super(props);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    public render() {
        return (
            <div className="infoItem" id="record">
                    <div id="recSelect">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.props.selectedWindowElement.state.record}
                                    onChange={this.handleSwitchChange}
                                    value="checkedA"
                                />
                            }
                            label="rec"
                        />
                    </div>
                </div>
        );
    }

    private handleSwitchChange(event: any) {
        this.props.selectedWindowElement.state.record = event.target.checked;
        SketchBoard.getInstance().setState({});
        this.setState({});
    }

}

export default RecordSection;