
export interface IMessage {
    readonly senderId: string,
    readonly text: string
}

export interface IGossip {

    sendMessage(message: IMessage): any;
    filterMessages(senderId: string): Promise<Array<string>>;

}

export default IGossip;