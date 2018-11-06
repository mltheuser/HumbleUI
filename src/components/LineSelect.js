import React, { Component } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

class LineSelect extends Component {
    state = {
        lineType: 10
    };

    handleChange(event) {
        this.setState({ lineType: event.target.value });
    } 

    render() {
        return (  
            <FormControl className="select">
            <InputLabel htmlFor="line-simple"></InputLabel>
            <Select
                value={this.state.lineType}
                onChange={this.handleChange.bind(this)}
                inputProps={{
                name: 'line',
                id: 'line-simple',
                }}
            >
                <MenuItem value={10}><div className="line solid"></div></MenuItem>
                <MenuItem value={20}><div className="line dashed"></div></MenuItem>
            </Select>
            </FormControl>
        );
    }
}

export default LineSelect;