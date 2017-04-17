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
    private cachedMessages: {};
    private redis: any;
    private transporter: any;

    constructor(gossip: IGossip) {
        this.gossipImpl = gossip;
        this.subscriptions = {};
        this.cachedMessages = {};
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

    subscribe(email: string, senderId: string, workerId): void {
        if(!(senderId in this.subscriptions)) {
            this.subscriptions[senderId] = {}
        }
        if(!(workerId in this.subscriptions[senderId])){
            this.subscriptions[senderId][workerId] = {};
        }
        this.subscriptions[senderId][workerId][email] = [];

        this.redis.subscribeToSender(senderId, this.handleMessage);
    }

    unsubscribe(email: string, senderId: string, workerId: string): void {

        // if(senderId in this.subscriptions) {
        //     delete this.subscriptions[senderId][workerId];
        //
        //     if(Object.keys(this.subscriptions[senderId]).length == 0) {
        //         delete this.subscriptions[senderId];
        //         //TODO: Add unsubscribe option
        //     }
        // }
    }

    sendMessage(email, senderId, workerId): void {
        const msgs = this.subscriptions[senderId][workerId][email];
        let buildString = "";
        buildString += "Time Report\n";
        buildString += "\n";
        buildString += `Approval Id: ${senderId}\n`;
        buildString += `Worker Id: ${workerId}\n`;
        buildString += "Time Events:\n"
        for (let msg of msgs) {
            buildString += msg+"\n";
        }
        this.sendEmail(email, "Time Report", buildString);
    }
    // handleMessage(msg): void {
    handleMessage = (msg) => {
        const senderId = msg.senderId;
        const workerIds = this.subscriptions[senderId];
        const msg_text = JSON.parse(msg.text)
        const workerId = msg_text['worker_id']
        if(!workerIds || !(workerId in workerIds)) {
            return;
        }

        const emails = workerIds[workerId]

        for (let email in emails) {
            if (emails.hasOwnProperty(email)) {
                const cnt = emails[email].length;
                if(cnt >= 10) {
                    this.sendMessage(email, senderId, workerId);
                    emails[email] = [];
                }
                else {
                    emails[email].push(msg_text['timestamp'])
                }
            }
        }
    }

    routes(): Router {
        const router = Router();

        router.post("/subscriptions", (req, res) => {
            let body = req.body;

            console.log("Here is the body: ", JSON.stringify(body));

            const email = body["email"];
            const subscribe = body["subscribe"]
            const senderId = body["senderId"];
            const workerId = body["workerId"];
            this.subscribe(email, senderId, workerId)
            let return_obj =  {
                "msg": `Emails will be sent to: ${email}`
            }
            res.send(return_obj);

        })

        router.get("/subscriptions", (req, res) => {
            let keys = [];
            let email = req.query.email;
            if (!email) {
                email = req.cookies["sessionEmail"]
            }
            if(!email)
            {
                return res.status(401).send(`You are not logged in.`);
            }
            for (let senderId in this.subscriptions) {
                if (this.subscriptions.hasOwnProperty(senderId)) {
                    for (let workerId in this.subscriptions[senderId]) {
                        if (this.subscriptions[senderId].hasOwnProperty(workerId)) {
                            if (email in this.subscriptions[senderId][workerId]) {
                                keys.push({
                                    "workerId": workerId,
                                    "senderId": senderId
                                })
                            }
                        }
                    }
                }
            }
            res.send(keys);
        })

        return router;
    }
}
