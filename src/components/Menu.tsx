import * as React from 'react';
import { IAppProps } from 'src/datatypes/interfaces';
import ExportButton from './ExportButton';

class Menu extends React.Component<IAppProps, any> {

    public sketchBoard: any = null;

    public render() {
        return (
           <div className="layout-menu">
                <ExportButton sketchBoard={this.props.app.sketchBoard}/>
           </div>
        );
    }
}

export default Menu;