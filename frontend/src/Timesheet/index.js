import React from "react";
import axios from "axios";

export default class Timesheet extends React.Component {

    constructor() {
        super();

        this.state = {
            timestamps: {}
        }

    }

    componentDidMount() {
        this.getJobIds().forEach(this.reloadTimestampsFor);
    }

    getJobIds = () => {
        if (this.props.userSettings) {
            return this.props.userSettings.jobs || [];
        } else {
            return [];
        }
    }

    reloadTimestampsFor = (workerId) => {
        axios.get(`/api/timestamps/${workerId}`)
            .then((resp) => {
                const currentState = this.state;
                currentState.timestamps[workerId] = resp.data;
                this.setState(currentState);
            });
    }

    renderClockButton = (jobid) => {
        const handleClick = () => {
            axios.post(`/api/timestamps/${jobid}`)
                .then((resp) => {
                    this.reloadTimestampsFor(jobid);
                })
        }        
        
        return (
            <button onClick={handleClick}>Clock in/out</button>
        )
    }

    renderClockEventsFor = (workerId) => {
        const clockEvents = this.state.timestamps[workerId] || []

        if (clockEvents.length === 0) {
            return <p>No recorded timestamps for this job</p>
        }

        let timePairs = [];
        for (let i = 0; i < clockEvents.length; i += 2) {
            timePairs.push([
                clockEvents[i],
                clockEvents[i+1] /* this will be undefined in event of mismatched clocks */
            ])
        }

        return timePairs.map((pair) => {
            const clockIn = pair[0].timestamp;
            const clockOut = pair[1] ? pair[1].timestamp : null;
            const key = pair[0].message_id;

            return (
                <tr key={key}>
                    <td>{clockIn}</td>
                    <td>{clockOut}</td>
                </tr>
            )
        })
    }

    renderWorkerIds = () => {
        const jobIds = this.getJobIds();

        if (jobIds.length > 0) {
            console.log("Here i am");
            console.log(jobIds);
            return this.props.userSettings["jobs"].map((jobid) => {
                return (
                    <div key={jobid}>
                        <p>
                            JOB: {jobid} &nbsp;
                            {this.renderClockButton(jobid)}
                        </p>

                        <table>
                            <thead><tr><th>In</th><th>Out</th></tr></thead>
                            <tbody>
                                {this.renderClockEventsFor(jobid)}
                            </tbody>
                        </table>

                        <hr />
                    </div>
                );
            });
        } else {
            return (<p>You have no jobs</p>);
        }

    }

    handleCreateNewJob = () => {
        console.log("Creating new job");
        axios.post("/api/jobs").then((resp) => {
            console.log("here it is");
            this.props.userSettings.requestReload();
        })

    }

    render() {
        return (
            <div className="gn-container">
                <h1>Your Timesheet</h1>

                <div>
                    <h2>Jobs</h2>
                    {this.renderWorkerIds()}

                    <button onClick={this.handleCreateNewJob}>Create new Job</button>

                </div>



            </div>
        )
    }

}