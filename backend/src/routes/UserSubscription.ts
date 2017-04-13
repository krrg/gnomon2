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
            let email = req.query.email;
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email)
            {
                return res.send(`You are not logged in.`);
            }

            this.userSettings.getSettings(email).then((userSettingsString:string) =>{
                let myUserSettings:IUserSettingsFormat, subscriptionsString:string
                myUserSettings = JSON.parse(userSettingsString);
                subscriptionsString = JSON.stringify(myUserSettings.subscriptions);
                return res.send(`${subscriptionsString}`);
            })
        })

        router.post("/userSubscription", (req, res) => {
            let email = req.body.email, subscriptionId = req.body["subscriptionId"];
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email){
                return res.send(`You are not logged in.`);
            }
            if (!subscriptionId) {
                console.log(req.body)
                return res.send(`You need to provide a subscriptionId.`);
            }

            this.userSettings.insertNewSubscriptionId(email,subscriptionId).then((result:string) =>{
                    return res.send(`${result}`);
            });
        });

        return router;

    }

}