import {IGossip, IMessage} from "./IGossip";
import Settings from "../Settings";

import * as Redis from "ioredis"

export default class RedisGossip implements IGossip {
    
    redis: Redis.Redis;

    constructor() {
        this.redis = new Redis(Settings.Redis);
    }

    async sendMessage(message: IMessage): Promise<number> {
        return await this.redis.rpush(message.senderId, message.text);
    }

    async filterMessages(senderId: string): Promise<ReadonlyArray<string>> {
        return await this.redis.lrange(senderId, 0, -1);
    }

}