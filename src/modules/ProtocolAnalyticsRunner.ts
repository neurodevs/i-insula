export default class ProtocolAnalyticsRunner implements AnalyticsRunner {
	public static Class?: AnalyticsRunnerConstructor
	
	protected constructor() {}
	
	public static Create() {
		return new (this.Class ?? this)()
	}
}

export interface AnalyticsRunner {}

export type AnalyticsRunnerConstructor = new () => AnalyticsRunner