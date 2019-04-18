import { Chart } from 'chart.js';
import * as React from 'react';
import { ISelectedWindowElementProps } from '../ResponseTabContent';

class ResponseOverview extends React.Component<ISelectedWindowElementProps, any> {

    public componentDidMount() {
        this.displayKeyFrameData();
    }

    public componentDidUpdate() {
        this.displayKeyFrameData();
    }

    public render() {
        return (
            <div className="infoItem" id="keyOverview">
                <div className="header">
                    <h3>OVERVIEW</h3>
                </div>
                <div className="infoPaper responseWindow">
                    <canvas id="responseOverview" width="90%" height="130px" />
                </div>
            </div>
        );
    }

    private displayKeyFrameData() {
        const ctx = (document.getElementById('responseOverview')! as HTMLCanvasElement).getContext('2d')!;

        const keyFrameCollection = this.props.selectedWindowElement.state.keyFrameCollection;
        const keyCoordinates = keyFrameCollection.getKeyCoordinates();

        const scatterChart = new Chart(ctx, {
            data: {
                datasets: [{
                    data: keyCoordinates,
                    pointBackgroundColor: "#427fd3",
                }],
            },
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                responsive: true, 
                scales: {
                    xAxes: [{
                        position: 'bottom',
                        type: 'linear',
                    }]
                },
            },
            type: 'scatter',
        });
        console.log(scatterChart);
    }
}

export default ResponseOverview;