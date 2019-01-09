import { FormControlLabel, Switch } from '@material-ui/core';
import * as React from 'react';
import { IAppProps } from 'src/datatypes/interfaces';
import DefaultTabContent from './DefaultTabContent';

class ResponseTabContent extends DefaultTabContent {

    public state = {
        recChecked: false,
    }

    public constructor(props: IAppProps) {
        super(props);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    public render() {
        return (
            <div className="tabContent">
                <div className="infoItem" id="record">
                    <div id="recSelect">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.recChecked}
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
        this.setState({ recChecked: event.target.checked });
    }
}

export default ResponseTabContent;