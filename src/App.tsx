import * as React from 'react';
import { SketchBoard } from './components/Board/SketchBoard';
import Info from './components/Info';
import Menu from './components/Menu';
import ToolPalate from './components/ToolPalate';

class App extends React.Component {

    public static getInstance(): App {
        return this.instance;
    }

    private static instance: App;

    constructor(props = {}) {
        super(props);
        if (App.instance) {
            throw EvalError("App is a Singelton and there for can not have more than one instance.");
        } else {
            App.instance = this;
        }
    }

    public render() {
        return (
            <div className="container">
                <div className="layout">
                    <Menu />
                    <div className="layout-top-bar" />
                    <div className="layout-content">
                        <ToolPalate />
                        <SketchBoard />
                        <Info/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
