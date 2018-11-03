import React, { Component } from 'react';

class Info extends Component {
    render() {
        return (  
            <div id="info">
                <div className="infoItem" id="positioningPresets"></div>
                <div className="infoItem" id="positioning"></div>
                <div className="infoItem" id="appearance"></div>
            </div>  
        );
    }
}

export default Info;