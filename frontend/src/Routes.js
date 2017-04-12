import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import NavigationBar from "./NavigationBar/index.js";

import "./index.scss";

export default class Root extends React.Component {

    render() {
        return (
            <div>
                <NavigationBar />
                
                <Router>
                    <Route path="/" component=>
                </Router>
            </div>
        )
    }

}