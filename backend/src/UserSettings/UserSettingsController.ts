import IGossip from "../gossip/IGossip";
import {IMessage} from "../gossip/IGossip";
import IUserSettingsFormat from "./IUserSettingsFormat";
import Guid from "./Guid"
import * as Redis from "ioredis"

export default class UserSettingsController {

    private gossipImpl: IGossip;

    constructor(gossipImpl: IGossip) {
        this.gossipImpl = gossipImpl;
    }

    async getSettings(email: string): Promise<string> {
        //todo: use new redis function for filterLastMessage
        let settingsList:Array<string>, currentSettings:string;
        settingsList = await this.gossipImpl.filterMessages(email);
        if(settingsList.length == 0)
        {
            let newUserSettings:IUserSettingsFormat, indexOfMessage:number;
            newUserSettings = this.createInitialSettings();
            indexOfMessage = await this.UpdateSettingsObject(email,newUserSettings);
            return this.getSettings(email)
        }

        currentSettings = settingsList[settingsList.length-1]
        return currentSettings;
    }

    async insertNewJobId(email:string):Promise<string>
    {
        let jobId:string, indexOfMessage:number, userSettingsString:string, userSettings:IUserSettingsFormat;
        jobId = this.createRandomId();
        userSettingsString = await this.getSettings(email);
        userSettings = JSON.parse(userSettingsString);
        userSettings.jobs.push(jobId);

        indexOfMessage = await this.UpdateSettingsObject(email,userSettings);
        return jobId;
    }

    private async UpdateSettingsObject(email:string, userSettings: IUserSettingsFormat): Promise<number>
    {
        let settingsMessage:IMessage;
        settingsMessage = {senderId:email, text:JSON.stringify(userSettings)};
        return await this.gossipImpl.sendMessage(settingsMessage);
    }

    private createInitialSettings(): IUserSettingsFormat{
        let defaultSettings:IUserSettingsFormat, newSenderId:string;
        newSenderId = this.createRandomId();
        defaultSettings = {signing_Id:newSenderId, jobs: new Array<string>(), subscriptions:new Array<string>()};
        return defaultSettings;
    }
    private createRandomId():string
    {
        return Guid.newGuid()
    }

}

