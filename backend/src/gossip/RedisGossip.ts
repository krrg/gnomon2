import {IGossip, IMessage} from "./IGossip";
import Settings from "../Settings";

import * as Redis from "ioredis"

export default class RedisGossip implements IGossip {

    redis: Redis.Redis;
    subRedis: Redis.Redis;

    constructor() {
        this.redis = new Redis(Settings.Redis);
        this.subRedis = new Redis(Settings.Redis); // Must use a second connection for subscriptions
    }

    async sendMessage(message: IMessage): Promise<number> {
        this.redis.publish(message.senderId, message.text);
        return await this.redis.rpush(message.senderId, message.text);
    }

    async filterMessages(senderId: string): Promise<ReadonlyArray<string>> {
        return await this.redis.lrange(senderId, 0, -1);
    }

    async filterLastMessage(senderId: string): Promise<string> {
        const arrayResult = await this.redis.lrange(senderId, -1, -1);
        if (arrayResult.length === 0) {
            return null;
        } else {
            return arrayResult[0];
        }
    }

    async subscribeToSender(senderId: string, callback: (msg: IMessage) => any): Promise<void> {
        await this.subRedis.subscribe(senderId);

        this.subRedis.on('message', function(channel, message) {
            callback({
                senderId: channel,
                text: message
            });
        })
    }

}