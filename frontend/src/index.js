/* This is the entrypoint for the application */

import React from "react";
import ReactDOM from "react-dom";

import NavigationBar from "./NavigationBar/index.js";

import "./index.scss";

class Root extends React.Component {

    render() {
        return (
            <div>
                <NavigationBar />
                Hello World
            </div>
        )
    }

}

document.body.innerHTML += '<div id="ReactAppEntry"></div>';

ReactDOM.render(
    <Root />,
    document.getElementById('ReactAppEntry')
)