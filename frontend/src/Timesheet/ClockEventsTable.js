import React from "react"

export default class ClockEventsTable extends React.Component {


    componentWillMount() {

    }

    renderClockEventRow = (workerId, clockIn, clockOut) => {
        if (typeof(this.props.renderClockEventRow) === 'function') {
            return this.props.renderClockEventRow(workerId, clockIn, clockOut);
        }

        const clockInDate = clockIn ? new Date(clockIn.timestamp).toTimeString() : null;
        const clockOutDate = clockOut ? new Date(clockOut.timestamp).toTimeString() : null;

        /* Or default to a minimal output */
        return (
            <tr key={`${clockIn.message_id}`}>
                <td>{clockInDate}</td>
                <td>{clockOutDate}</td>
            </tr>
        );
    }


    renderClockEventsFor = (workerId) => {
        const clockEvents = this.props.timestamps || [];

        let timePairs = [];
        for (let i = 0; i < clockEvents.length; i += 2) {
            timePairs.push([
                clockEvents[i],
                clockEvents[i+1] /* this will be undefined in event of mismatched clocks */
            ])
        }

        return timePairs.map((pair) => {
            const clockIn = pair[0]
            const clockOut = pair[1] || null;
            return this.renderClockEventRow(workerId, clockIn, clockOut);
        })
    }

    render() {
        if (! this.props.timestamps) {
            return (<p>You have no clock events</p>);
        }

        return (
            <table>
                <thead><tr><th>In</th><th>Out</th></tr></thead>
                <tbody>
                    {this.renderClockEventsFor(this.props.jobid)}
                </tbody>
            </table>
        );
    }

}