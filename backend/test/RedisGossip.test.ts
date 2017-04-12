import RedisGossip from "../src/gossip/RedisGossip";
import * as _ from "lodash";

describe("Redis Gossip implementation", () => {

    it("should push messages onto the list", async () => {
        const redis = new RedisGossip();

        const index = await redis.sendMessage({
            senderId: `test-key${Math.random()}`,
            text: "This is the message"
        });

        console.log("I am completing, further my index was: " + index);
    })

    it("can read back a list of messages", async () => {

        const redis = new RedisGossip();

        await _.times(10, async () => {
            await redis.sendMessage({
                senderId: `Ken!`,
                text: `This is test message ${Math.random()}`
            });
        });

        // TODO: Turn this into a legit test.
        console.log(await redis.filterMessages('Ken!'))

    })

    it("retrieves the last message", async () => {

        const redis = new RedisGossip();

        await _.times(10, async () => {
            await redis.sendMessage({
                senderId: "Glummy",
                text: `This is a test ${Math.random()}`
            })
        });

        console.log(await redis.filterLastMessage("Glummy"))


    })

    it("publishes a message on the sender's channel", (done) => {
        const redis = new RedisGossip();

        /* This wrapper is just so we can avoid returning a promise from the unit test
            and confusing mocha. */
        (async () => {

            /* we have to await because it takes a round trip to the server to subscribe */
            await redis.subscribeToSender("ken@example.com", (msg) => {
                console.log(msg);
                done();
            });

            redis.sendMessage({
                senderId: "ken@example.com",
                text: "Hello World"
            })

        })();
        
    })

})