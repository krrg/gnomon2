/* This is the entrypoint for the application */

import React from "react";
import ReactDOM from "react-dom";

class Root extends React.Component {

    render() {
        return (
            <div>Hello World</div>
        )
    }

}

console.log("hello world");

ReactDOM.render(
    <Root />,
    document.getElementById('ReactAppEntry')
)