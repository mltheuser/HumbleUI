import * as React from 'react';

class DefaultTabContent extends React.Component {

    public constructor(props = {}) {
        super(props);
    }

    public render() {
        return (
            <div id="info">
                <div className="infoItem" id="tabPannel" />
                <div className="infoItem" id="positioning" />
                <div className="infoItem" id="appearance" />
            </div>
        );
    }
}

export default DefaultTabContent;