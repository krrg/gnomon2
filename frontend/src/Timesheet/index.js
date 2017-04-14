import React from "react";
import axios from "axios";

import ClockEventsTable from "./ClockEventsTable";

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

    renderWorkerIds = () => {
        const jobIds = this.getJobIds();

        if (jobIds.length > 0) {
            return this.props.userSettings["jobs"].map((jobid) => {
                return (
                    <div key={jobid}>
                        <p>
                            JOB: {jobid} &nbsp;
                            {this.renderClockButton(jobid)}
                        </p>

                        <ClockEventsTable 
                            jobid={jobid} 
                            timestamps={this.state.timestamps[jobid]}
                        />

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
        });
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