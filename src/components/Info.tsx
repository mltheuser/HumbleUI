import { withStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import AppearanceTabContent from './AppearanceTabContent';
import { Window } from './Board/BoardElements/Window';
import { WindowElement } from './Board/BoardElements/WindowElement';
import { SketchBoard } from './Board/SketchBoard';
import DefaultTabContent from './DefaultTabContent';
import ResponseTabContent from './ResponseTabContent';

/**
 * @todo improve the templating
 */
class Info extends React.Component<any, any> {

    public state = {
        value: 0,
    };

    /**
     * This is an absolute mess and must be reworked.
     */
    public render() {
        const { classes } = this.props;
        const { value } = this.state;
        const selectedBoardElement = SketchBoard.getInstance().state.selectedBoardElement;
        if (selectedBoardElement === null || selectedBoardElement.state.refined === false) {
            return (
                <DefaultTabContent />
            );
        }
        if (selectedBoardElement instanceof Window) {
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
                            </Tabs>
                        </div>
                        {value === 0 && <AppearanceTabContent />}
                    </div>
                </div>
            );
        }
        if (selectedBoardElement instanceof WindowElement) {
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
                        {value === 0 && <AppearanceTabContent />}
                        {value === 1 && <ResponseTabContent />}
                    </div>
                </div>
            );
        }
        return (
            <DefaultTabContent />
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