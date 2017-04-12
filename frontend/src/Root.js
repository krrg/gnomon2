import React from "react";
import NavigationBar from "./NavigationBar/index.js";

import "./Root.scss";

export default class Root extends React.Component {

    render() {
        return (
            <div>
                <NavigationBar />
                Hello World
            </div>
        )
    }

}