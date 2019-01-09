import * as React from 'react';
import { IAppProps } from 'src/datatypes/interfaces';

class DefaultTabContent extends React.Component<IAppProps, any> {
    protected sketchBoard = this.props.app.sketchBoard;

    public constructor(props: IAppProps) {
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