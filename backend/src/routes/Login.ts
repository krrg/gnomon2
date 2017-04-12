import * as express from "express";
import IRouter from "./IRouter";
import Settings from "../Settings";
var request = require('request');

export default class LoginRouter implements IRouter {
// "OAUTH2_CALLBACK": "https://[YOUR_PROJECT_ID].appspot.com/auth/google/callback"
// https://accounts.google.com/o/oauth2/auth
// https://accounts.google.com/o/oauth2/token

    private oauth2: any;
    private authorization_uri: any;

    constructor() {

        const credentials = {
          client: {
            id: Settings.Login.client_id,
            secret: Settings.Login.client_secret
          },
          auth: {
            tokenHost: 'https://accounts.google.com',
            tokenPath: '/o/oauth2/token',
            authorizePath: '/o/oauth2/auth'
          }
        };

        this.oauth2 = require('simple-oauth2').create(credentials);

        this.authorization_uri = this.oauth2.authorizationCode.authorizeURL({
            redirect_uri: Settings.Login.auth_return_url,
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        });
    }

    routes(): express.Router {
        const router = express.Router()

        router.get('/login', (req, res) => {
            if (req.query.email === undefined) {
                return res.send(`I am logging you in through Gmail`)
            } else {
                const email = req.query.email;

                /* Dump a completely insecure garbage cookie over */
                res.cookie("sessionEmail", email);

                //todo: attempt to get back data from database and put it in a cookie
                //data = gossipImpl.filterMessages(email)
                //if (data == null){
                    //newSenderID = hash(email) or random string
                    //defaultDatabaseEntry = Json.stringify({senderID = newSenderID, jobs=[], subscriptions=[]})
                    //gossipImpl.sendMessage( new Message (senderID =email, text=defaultDatabaseEntry)
                    //res.cookie("userData", data);
                    //data = gossipImpl.filterMessages(email)
                //}
                return res.send(`Okay, I will blindly login as ${email}`)
            }

        });

        router.get('/auth', (req, res) => {
            res.redirect(this.authorization_uri);
        });

        router.get('/login/return', (req, res) => {
            // Handle Google coming back to us with stuff.
            let code = req.query.code;
            const tokenConfig = {
                code: code,
                redirect_uri: Settings.Login.auth_return_url
            };
            let self = this;
            this.oauth2.authorizationCode.getToken(tokenConfig, (error, result) => {
                if (error) {
                    return console.log('Access Token Error', error.message);
                }

                const token = self.oauth2.accessToken.create(result);
                var options = {
                    url: 'https://www.googleapis.com/oauth2/v1/userinfo',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer "+token.token.access_token
                    }
                };

                request(options, function (error, response, body) {
                    if (error) {
                        return console.log('userinfo error', error.message);
                    }
                    let email = JSON.parse(body)['email']
                    res.redirect(`/api/login?email=${email}`);
                });
            });
        })

        router.get('/logout', (req, res) => {
            res.clearCookie("sessionEmail");
            return res.send("Logged out.");
        })

        return router;
    }

}
