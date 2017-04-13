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

        router.get("/jobs", (req, res) => {
            let email = req.query.email;
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email)
            {
                return res.send(`You are not logged in.`);
            }

            this.userSettings.getSettings(email).then((userSettingsString:string) =>{
                let myUserSettings:IUserSettingsFormat, jobsString:string
                myUserSettings = JSON.parse(userSettingsString);
                jobsString = JSON.stringify(myUserSettings.jobs);
                return res.send(`${jobsString}`);
            })
        })

        router.post("/jobs", (req, res) => {
            let email = req.body["email"];
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email)
            {
                return res.send(`You are not logged in.`);
            }
        
            this.userSettings.insertNewJobId(email).then((result:string) =>{
                    return res.send(`${result}`);
            });

        });

        return router;

    }

}
