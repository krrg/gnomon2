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

            //Luke: Does this mean, get all clock events the user submitted or do we include everything they are subscribed to?
            //Luke: either way it looks like we can use gossipImpl.filterMessages(senderID=??? will the "senderID" field work? or are we to filter on all of the worker IDs?)
            // Otherwise send back the list of events.
            return res.send(`Your email is ${email}`);
        })

        router.post("/clock", (req, res) => {
            // Create a new clock event with the logged in user.
            // Their ID will be in a cookie. They optionally specify the worker id and optionally the timestamp.
            // Timestamp defaults to current time (Date.now())
            // Worker ID defaults to their ID

            //Luke: From what I remember this function should do the following:
                //get the worker id, or as default, get the first worker id
                    //if they dont have any worker id, then create one for them?
                //get the timestamp, or as default, get current time
                //do gossipImpl.sendMessage(senderID=workerID, text=Json.stringify({owner:workerID, time: timestam   }))

            return res.send("Not implemented yet.");
        });

        return router;

    }

}
