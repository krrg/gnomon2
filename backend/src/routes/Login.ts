import * as express from "express";
import IRouter from "./IRouter";

export default class LoginRouter implements IRouter {

    routes(): express.Router {
        const router = express.Router()

        router.get('/login', (req, res) => {
            if (req.query.email === undefined) {
                return res.send(`I am logging you in through Gmail`)
            } else {
                const email = req.query.email;

                /* Dump a completely insecure garbage cookie over */
                res.cookie("sessionEmail", email);

                return res.send(`Okay, I will blindly login as ${email}`)
            }

        });

        router.get('/login/return', (req, res) => {
            // Handle Google coming back to us with stuff.
        })

        router.get('/logout', (req, res) => {
            res.clearCookie("sessionEmail");
            return res.send("Logged out.");
        })

        return router;
    }

}