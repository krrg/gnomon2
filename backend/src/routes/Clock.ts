import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";
import UserSettingsController from "../usersettings/UserSettingsController"
import IUserSettingsFormat from "../usersettings/IUserSettingsFormat";
import {IMessage} from "../gossip/IGossip";
import Guid from "../utils/Guid"
import IClockFormat from "../clock/IClockFormat"

export default class Clock implements IRouter {

    private gossipImpl: IGossip;
    private userSettings: UserSettingsController;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
        this.userSettings = new UserSettingsController(this.gossipImpl);
    }

    routes(): express.Router {

        let router = express.Router();

        router.get("/timestamps/:senderId", (req, res) => {
            this.gossipImpl.filterMessages(req.params.senderId).then((clockMessages:ReadonlyArray<string>) =>{
                return res.send(clockMessages.map((msg) => {return JSON.parse(msg)}));
            });
        })

        router.post("/timestamps/:workerId", (req, res) => {
            let email = req.body["email"], timestamp = req.body["timestamp"], workerId=req.params["workerId"];
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email)
            {
                return res.send(`You are not logged in.`);
            }

            if (!timestamp) {
                timestamp = Date.now();
            }
            else
            {
                timestamp = parseInt(timestamp)
                if(isNaN(timestamp))
                {
                    return res.send(`The timestamp provided is not a number.`);
                }
            }

            this.userSettings.getSettings(email).then((userSettingsString:string) =>{
                let myUserSettings:IUserSettingsFormat, jobsString:string
                myUserSettings = JSON.parse(userSettingsString);

                if (!workerId) {
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
                    if(myUserSettings.jobs.indexOf(workerId) === -1)
                    {
                        return res.send(`You have do not have a job with that id.`);
                    }
                }
                //workerId is valid
                let clockMessage:IMessage;
                clockMessage = this.createClockMessage(workerId, timestamp);
                this.gossipImpl.sendMessage(clockMessage).then((indexOfMessage) =>{
                    return res.send(`The clock event was sent successfully.`);
                });
            })
        });

        router.post("/timestamps/:messageId/sign", (req, res) => {
            let email = req.body["email"], messageId = req.params.messageId, senderId = req.body["senderId"];
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email)
            {
                return res.send(`You are not logged in.`);
            }
            if (!messageId) {
                return res.send(`You need to provide a messageId to sign.`);
            }
            if (!senderId) {
                return res.send(`You need to provide a senderId (the owner of the message, or previous signer).`);
            }

            this.userSettings.getSettings(email).then((userSettingsString:string) =>{
                let myUserSettings:IUserSettingsFormat, signingId:string;
                myUserSettings = JSON.parse(userSettingsString);
                
                signingId = myUserSettings.signing_id;

                this.gossipImpl.filterMessages(senderId).then((clockMessages:ReadonlyArray<string>) =>{
                    let clockMessage:IMessage, clockDataToSign:IClockFormat;
                    clockDataToSign = this.findClockMessageWithId(clockMessages, messageId)

                    if(clockDataToSign === null)
                    {
                        return res.send(`The clock event specified does not exist.`);
                    }
                    else{
                        clockMessage = {senderId:signingId, text:JSON.stringify(clockDataToSign)};
                        this.gossipImpl.sendMessage(clockMessage).then((indexOfMessage) =>{
                            return res.send(`The clock event was signed successfully.`);
                        });
                    }

                });
            });

        });

        router.get("/timestamps/:messageId/isSigned", (req, res) => {
            let email = req.query.email, messageId = req.params.messageId;
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email)
            {
                return res.status(401).send();
            }
            if (!messageId) {
                return res.send(`You need to provide a messageId to sign.`);
            }

            this.userSettings.getSettings(email).then((userSettingsString:string) =>{
                let myUserSettings:IUserSettingsFormat, signingId:string;
                myUserSettings = JSON.parse(userSettingsString);
                
                signingId = myUserSettings.signing_id;

                this.gossipImpl.filterMessages(signingId).then((signedMessages:ReadonlyArray<string>) =>{
                    let signedMessage:IMessage, clockDataThatIsSigned:IClockFormat;
                    clockDataThatIsSigned = this.findClockMessageWithId(signedMessages, messageId)
                    if(clockDataThatIsSigned === null)
                    {
                        return res.send({signed: false});
                    }
                    else{
                        return res.send({signed: true});
                    }

                });
            });

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

    private findClockMessageWithId(clockMessages:ReadonlyArray<string>, messageId:string):IClockFormat
    {

        let myClockInData:IClockFormat = null;
        clockMessages.forEach(clockMessage => {

            if(myClockInData != null)
            {
                return;
            }
            let clockInData:IClockFormat;
            clockInData = JSON.parse(clockMessage);
            if(clockInData.message_id == messageId)
            {
                myClockInData = clockInData;
            }
        });
        return myClockInData;
    }

    private createRandomId():string
    {
        return Guid.newGuid()
    }
}
