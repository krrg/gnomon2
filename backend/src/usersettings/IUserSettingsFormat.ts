
export interface IUserSettingsFormat {
    readonly email:string,
    readonly signing_id: string,
    readonly jobs: Array<string>,
    readonly subscriptions: Array<string>
}

export default IUserSettingsFormat;