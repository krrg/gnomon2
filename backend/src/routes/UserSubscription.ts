import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";
import UserSettingsController from "../UserSettings/UserSettingsController"
import IUserSettingsFormat from "../UserSettings/IUserSettingsFormat";

export default class UserSubscriptionRouter implements IRouter {

    private gossipImpl: IGossip;
    private userSettings: UserSettingsController;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
        this.userSettings = new UserSettingsController(this.gossipImpl);
    }

    routes(): express.Router {

        let router = express.Router();

        router.get("/userSubscription", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }
            if(email === undefined)
            {
                return res.send(`You are not logged in.`);
            }

            this.userSettings.getSettings(email).then((userSettingsString) =>{
                let myUserSettings:IUserSettingsFormat, subscriptionsString:string
                myUserSettings = JSON.parse(userSettingsString);
                subscriptionsString = JSON.stringify(myUserSettings.subscriptions);
                return res.send(`${subscriptionsString}`);
            })
        })

        router.post("/userSubscription", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }
            if(email === undefined)
            {
                return res.send(`You are not logged in.`);
            }
            if (req.query.subscriptionId === undefined) {
                return res.send(`You need to provide a subscriptionId.`);
            }

            this.userSettings.insertNewSubscriptionId(email,req.query.subscriptionId).then((subscriptionId) =>{
                    return res.send(`${subscriptionId}`);
            });
        });

        return router;

    }

}
