
export interface IUserSettingsFormat {
    readonly signing_Id: string,
    readonly jobs: Array<string>,
    readonly subscriptions: Array<string>
}

export default IUserSettingsFormat;