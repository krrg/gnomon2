import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import NavigationBar from "./NavigationBar";

import Approvals from "./Approvals";
import Emails from "./Emails";
import Login from "./Login";
import Timesheet from "./Timesheet";

import "./index.scss";

export default class Root extends React.Component {

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <NavigationBar />
                        <Switch>
                            <Route exact path="/" component={Login} />
                            <Route path="/login" component={Login} />
                            <Route path="/timesheet" component={Timesheet} />
                            <Route path="/approvals" component={Approvals} />
                            <Route path="/emails" component={Emails} />
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }

}