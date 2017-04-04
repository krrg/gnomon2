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

})