import { withStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import AppearanceTabContent from './AppearanceTabContent';
import DefaultTabContent from './DefaultTabContent';
import ResponseTabContent from './ResponseTabContent';

class Info extends React.Component<any, any> {

    public state = {
        value: 0,
    };

    private sketchBoard = this.props.app.sketchBoard;

    public render() {
        const { classes } = this.props;
        const { value } = this.state;
        if (this.sketchBoard.state.selected === null || this.sketchBoard.state.selected.state.refined === false) {
            return (
                <DefaultTabContent app={this.props.app} />
            );
        }
        return (
            <div id="info">
                <div className="infoTab">
                    <div id="tabPannel" className="infoItem">
                        <Tabs
                            value={value}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={this.handleChange}
                            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                        >
                            <Tab
                                label="APPEARANCE"
                                classes={{ root: classes.tabRoot, selected: classes.tabSelected, labelContainer: classes.labelContainer }}
                            />
                            <Tab
                                label="RESPONSE"
                                classes={{ root: classes.tabRoot, selected: classes.tabSelected, labelContainer: classes.labelContainer }}
                            />
                        </Tabs>
                    </div>
                    {value === 0 && <AppearanceTabContent app={this.props.app} />}
                    {value === 1 && <ResponseTabContent app={this.props.app} />}
                </div>
            </div>
        );
    }

    private handleChange = (event: any, value: any) => {
        this.setState({ value });
    };
}

export default withStyles(
    (theme) => ({
        labelContainer: {
            paddingLeft: '12px',
            paddingRight: '12px',
        },
        tabRoot: {
            '&$tabSelected': {
                color: 'rgba(0, 0, 0, 0.75)',
            },
            fontSize: '13px',
            minWidth: 72,
            textTransform: 'initial',
        },
        tabSelected: {},
        tabsIndicator: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        tabsRoot: {
            borderBottom: '1px solid #e8e8e8',
        },
    })
)(Info);