
export interface IUserSettingsFormat {
    readonly signing_id: string,
    readonly jobs: Array<string>,
    readonly subscriptions: Array<string>
}

export default IUserSettingsFormat;