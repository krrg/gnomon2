
export interface IMessage {
    readonly senderId: string,
    readonly text: string
}

export interface IGossip {
    sendMessage(message: IMessage): any;
    filterMessages(senderId: string): Promise<Array<string>>;
    filterLastMessage(senderId: string): Promise<string>;
    subscribeToSender(senderId: string, callback: (msg: IMessage) => any): any;
}

export default IGossip;