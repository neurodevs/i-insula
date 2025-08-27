export default class P001 implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor
	
	protected constructor() {}
	
	public static Create() {
		return new (this.Class ?? this)()
	}
}

export interface ProtocolRunner {}

export type ProtocolRunnerConstructor = new () => ProtocolRunner