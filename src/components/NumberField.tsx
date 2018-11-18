import { TextField } from '@material-ui/core';
import * as React from 'react';

class NumberField extends React.Component {

    public state = {
        num: 1
    }

    public constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (  
            <TextField
            id="standard-number"
            value={this.state.num}
            onChange={this.handleChange}
            type="number"
            className="Number"
            InputLabelProps={{
                shrink: true,
            }}
            margin="normal"
            />  
        );
    }

    private handleChange(event: any) {
        this.setState({
            num: event.target.value,
        });
    }
}

export default NumberField;