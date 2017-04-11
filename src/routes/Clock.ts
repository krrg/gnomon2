import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";


export default class Clock implements IRouter {

    private gossipImpl: IGossip;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
    }

    routes(): express.Router {

        let router = express.Router();

        router.get("/clockEvents", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }

            // Otherwise send back the list of events.
            return res.send(`Your email is ${email}`);
        })

        router.post("/clock", (req, res) => {
            // Create a new clock event with the logged in user.
            // Their ID will be in a cookie. They optionally specify the worker id and optionally the timestamp.
            // Timestamp defaults to current time (Date.now())
            // Worker ID defaults to their ID
            return res.send("Not implemented yet.");
        });

        return router;

    }

}
