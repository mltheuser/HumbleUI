import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';

class LineSelect extends React.Component<any, any> {

    public state = {
        lineType: 10
    };

    public constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <FormControl className="select">
                <InputLabel htmlFor="line-simple"/>
                <Select
                    value={this.state.lineType}
                    onChange={this.handleChange}
                    inputProps={{
                        id: 'line-simple',
                        name: 'line',
                    }}
                >
                    <MenuItem value={10}><div className="line solid"/></MenuItem>
                    <MenuItem value={20}><div className="line dashed"/></MenuItem>
                </Select>
            </FormControl>
        );
    }

    private handleChange(event: any) {
        this.setState({ lineType: event.target.value });
    }
}

export default LineSelect;