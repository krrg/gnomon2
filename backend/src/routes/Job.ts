import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";
import UserSettingsController from "../UserSettings/UserSettingsController"
import IUserSettingsFormat from "../UserSettings/IUserSettingsFormat";


export default class JobRouter implements IRouter {

    private gossipImpl: IGossip;
    private userSettings: UserSettingsController;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
        this.userSettings = new UserSettingsController(this.gossipImpl);
    }

    routes(): express.Router {

        let router = express.Router();

        router.get("/job", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }
            if(email === undefined)
            {
                return res.send(`You are not logged in.`);
            }

            this.userSettings.getSettings(email).then((userSettingsString) =>{
                let myUserSettings:IUserSettingsFormat, jobsString:string
                myUserSettings = JSON.parse(userSettingsString);
                jobsString = JSON.stringify(myUserSettings.jobs);
                return res.send(`${jobsString}`);
            })
        })

        router.post("/job", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }
            if(email === undefined)
            {
                return res.send(`You are not logged in.`);
            }
        
            this.userSettings.insertNewJobId(email).then((jobId) =>{
                    return res.send(`${jobId}`);
            });

        });

        return router;

    }

}
