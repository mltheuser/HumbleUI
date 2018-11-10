import * as React from 'react';
import Info from './components/Info';
import SketchBoard from './components/SketchBoard';
import ToolPalate from './components/ToolPalate';

class App extends React.Component {
    public render() {
        return (
            <div className="container">
                <div className="layout">
                    <div className="layout-top-bar"/>
                    <div className="layout-content">
                        <ToolPalate app={this}/>
                        <SketchBoard app={this}/>
                        <Info app={this}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
