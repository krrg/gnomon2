import {Router} from "express";

import IRouter from "./IRouter";
import IGossip from "../gossip/IGossip";
const debug = require('debug')('gnomon');
import RedisGossip from "../gossip/RedisGossip";
const nodemailer = require('nodemailer');
import Settings from "../Settings";


export default class Email implements IRouter {

    private gossipImpl: IGossip;
    private subscriptions: {};
    private redis: any;
    private transporter: any;

    constructor(gossip: IGossip) {
        this.gossipImpl = gossip;
        this.subscriptions = {};
        this.redis = new RedisGossip();

        let cachedTransporter = null;
        this.transporter = () => {
            if (cachedTransporter) {
                return cachedTransporter;
            }

            cachedTransporter = nodemailer.createTransport({
                service: 'gmail',
                    auth: {
                        user: Settings["Email"].username,
                        pass: Settings["Email"].password
                    }
                });
            return cachedTransporter;
        }

        //Uncomment below to test emailer... but don't send emails to me
        // this.sendEmail("cwig5945@gmail.com", "You got and email", "Here is a message");
    }

    sendEmail(to_email: string, subject: string, message: string): void {
        let mailOptions = {
            from: 'Time Service <gnomondev@gmail.com>',
            to: to_email,
            subject: subject,
            text: message
        };
        this.transporter().sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

    subscribe(senderId: string, workerId): void {
        if(!(senderId in this.subscriptions)) {
            this.subscriptions[senderId] = {}
        }
        this.subscriptions[senderId][workerId] = true;
        this.redis.subscribeToSender(senderId, this.handleMessage)
    }

    unsubscribe(senderId: string, workerId): void {
        if(senderId in this.subscriptions) {
            delete this.subscriptions[senderId][workerId];

            if(Object.keys(this.subscriptions[senderId]).length == 0) {
                delete this.subscriptions[senderId];
                //TODO: Add unsubscribe option
            }
        }
    }

    handleMessage(msg): void {

        if(!("senderId" in msg) || !("workerId" in msg)) {
            return;
        }

        workerIds = this.subscriptions[msg['senderId']]
        if(workerIds && msg['workerId'] in workerIds) {
            //Maybe send an email here...
        }
        console.log(msg)
    }

    routes(): Router {
        const router = Router();

        router.post("/subscriptions", (req, res) => {
            let body = req.body;
            let subscribe = body["subscribe"]
            let senderId = body["senderId"];
            let workerId = body["workerId"];
            if(subscribe) {
                this.subscribe(senderId, workerId)
                let return_obj =  {
                    "msg": `Emails will be sent regarding messages with Sender Id: ${email}`
                }
                res.send(return_obj);
            }
            else {
                this.unsubscribe(senderId, workerId)
                let return_obj =  {
                    "msg": `Sender Id has now been unsubscribed: ${email}`
                }
                res.send(return_obj);
            }
        })

        router.get("/subscriptions", (req, res) => {
            let keys = [];
            for (let key in this.subscriptions) {
                if (this.subscriptions.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            res.send(keys);
        })

        return router;
    }


}
