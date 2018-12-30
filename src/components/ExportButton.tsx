import { IconButton, Menu, MenuItem } from '@material-ui/core';
import * as React from 'react';
import Exporter from 'src/utilities/Exporter';

class ExportButton extends React.Component<any, any> {

    public state = {
        anchorEl: null,
        value: 0,
    }

    public constructor(props: any) {
        super(props);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleExportSelected = this.handleExportSelected.bind(this);
        this.handleExportSketchboard = this.handleExportSketchboard.bind(this);
    }

    public render() {
        const open = Boolean(this.state.anchorEl);
        return (
            <div>
                <IconButton
                    aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                    className="export-button"
                >
                    <svg height="24px" version="1.1" viewBox="0 0 48 48" width="24px">
                        <g fill="none" fillRule="evenodd" id="Page-2" stroke="none" strokeWidth="1">
                            <g fill="rgba(0, 0, 0, 0.54)">
                                <path d="M24,2 L16,10 L22,10 L22,30 L26,30 L26,10 L32,10 L24,2 Z M10,46 L38,46 C40.22,46 42,44.2 42,42 L42,18 C42,15.8 40.22,14 38,14 L30,14 L30,18 L38,18 L38,42 L10,42 L10,18 L18,18 L18,14 L10,14 C7.8,14 6,15.8 6,18 L6,42 C6,44.2 7.78,46 10,46 L10,46 Z" id="Fill-2" />
                            </g>
                        </g>
                    </svg>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'top',
                    }}
                    transformOrigin={{
                        horizontal: 'right',
                        vertical: 'top',
                    }}
                    open={open}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleExportSelected}>Export Selected</MenuItem>
                    <MenuItem onClick={this.handleExportSketchboard}>Export Sketchboard</MenuItem>
                </Menu>
            </div>
        );
    }

    private handleMenu(event: any) {
        this.setState({ anchorEl: event.currentTarget });
    }

    private handleClose() {
        this.setState({ anchorEl: null });
    }

    private handleExportSelected() {
        const sketchBoard = this.props.sketchBoard;
        const targetId = sketchBoard.state.selected.id[0];
        const target = sketchBoard.findElementById(sketchBoard, targetId);
        Exporter.download([target]);
        this.handleClose();
    }

    private handleExportSketchboard() {
        const sketchBoard = this.props.sketchBoard;
        Exporter.download(sketchBoard.state.sketches.data);
        this.handleClose();
    }

}

export default ExportButton;