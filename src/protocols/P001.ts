import TactileStimulusController from "../modules/TactileStimulusController"

export default class P001 implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor
	
	protected constructor() {}
	
	public static async Create() {
		await TactileStimulusController.Create()
		return new (this.Class ?? this)()
	}
}

export interface ProtocolRunner {}

export type ProtocolRunnerConstructor = new () => ProtocolRunner