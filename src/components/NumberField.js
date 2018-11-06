import React, { Component } from 'react';
import { TextField } from '@material-ui/core';

class NumberField extends Component {
    state = {
        num: 1
    }

    handleChange(event) {
        this.setState({
            num: event.target.value,
        });
    }

    render() {
        return (  
            <TextField
            id="standard-number"
            value={this.state.num}
            onChange={this.handleChange.bind(this)}
            type="number"
            className="Number"
            InputLabelProps={{
                shrink: true,
            }}
            margin="normal"
            />  
        );
    }
}

export default NumberField;