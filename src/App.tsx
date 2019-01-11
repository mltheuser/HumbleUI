import * as React from 'react';
import SketchBoard from './components/Board/SketchBoard';
import Info from './components/Info';
import Menu from './components/Menu';
import ToolPalate from './components/ToolPalate';

class App extends React.Component {

    public sketchBoard: any = null;

    public render() {
        return (
            <div className="container">
                <div className="layout">
                    <Menu app={this}/>
                    <div className="layout-top-bar" />
                    <div className="layout-content">
                        <ToolPalate app={this} />
                        <SketchBoard app={this} />
                        <Info app={this} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
