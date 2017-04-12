import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";
import UserSettingsController from "../UserSettings/UserSettingsController"
import IUserSettingsFormat from "../UserSettings/IUserSettingsFormat";
import {IMessage} from "../gossip/IGossip";
import Guid from "../Utils/Guid"
import IClockFormat from "../Clock/IClockFormat"

export default class Clock implements IRouter {

    private gossipImpl: IGossip;
    private userSettings: UserSettingsController;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
        this.userSettings = new UserSettingsController(this.gossipImpl);
    }

    routes(): express.Router {

        let router = express.Router();

        router.get("/clockEvents", (req, res) => {
            let email = null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }
            if(email === undefined)
            {
                return res.send(`You are not logged in.`);
            }
            if (req.query.senderId === undefined) {

                return res.send(`You need to provide a senderId.`);
            }
            
            this.gossipImpl.filterMessages(req.query.senderId).then((clockMessages:ReadonlyArray<string>) =>{
                return res.send(`${clockMessages}`);
            });
        })

        router.post("/clock", (req, res) => {
            let email = null, timestamp = null, workerId=null;
            if (req.query.email === undefined) {
                email = req.cookies["sessionEmail"]
            }
            if(email === undefined)
            {
                return res.send(`You are not logged in.`);
            }

            if (req.query.timestamp === undefined) {
                timestamp = Date.now();
            }
            else
            {
                timestamp = parseInt(req.query.timestamp)
                if(isNaN(timestamp))
                {
                    return res.send(`The timestamp provided is not a number.`);
                }
            }

            this.userSettings.getSettings(email).then((userSettingsString:string) =>{
                let myUserSettings:IUserSettingsFormat, jobsString:string
                myUserSettings = JSON.parse(userSettingsString);

                if (req.query.workerId === undefined) {
                    if(myUserSettings.jobs.length !== 0)
                    {
                        //default to first job
                        workerId = myUserSettings.jobs[0]
                    }
                    else{
                        return res.send(`You have no jobs to clock in from.`);
                    }
                }
                else
                {
                    workerId = req.query.workerId;
                    if(myUserSettings.jobs.indexOf(workerId) === -1)
                    {
                        return res.send(`You have do not have a job with that id.`);
                    }
                }
                //workerId is valid
                let clockMessage:IMessage;
                clockMessage = this.createClockMessage(workerId, timestamp);
                this.gossipImpl.sendMessage(clockMessage).then((indexOfMessage) =>{
                    return res.send(`The clock message was sent successfully`);
                });
            })
        });

        return router;

    }

    private createClockMessage(workerId:string, timestamp:number):IMessage
    {
        let clockMessage:IMessage, clockInData:IClockFormat, message_id:string;
        message_id = this.createRandomId();
        clockInData = {worker_id:workerId, timestamp: timestamp, message_id:message_id};
        clockMessage = {senderId:workerId, text:JSON.stringify(clockInData)};
        return clockMessage;
    }

    private createRandomId():string
    {
        return Guid.newGuid()
    }
}
