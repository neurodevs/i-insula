import { WaveshareRoboticArm } from "@neurodevs/node-robotic-arm"

export default class TactileStimulusController implements StimulusController {
	public static Class?: StimulusControllerConstructor
	
	protected constructor() {}
	
	public static async Create() {
		await WaveshareRoboticArm.Create()
		return new (this.Class ?? this)()
	}
}

export interface StimulusController {}

export type StimulusControllerConstructor = new () => StimulusController
