import { RoboticArm, WaveshareRoboticArm } from "@neurodevs/node-robotic-arm"

export default class TactileStimulusController implements StimulusController {
	public static Class?: StimulusControllerConstructor

	private arm: RoboticArm

	protected constructor(arm: RoboticArm) {
		this.arm = arm
	}

	public static async Create() {
		const arm = await WaveshareRoboticArm.Create()
		return new (this.Class ?? this)(arm)
	}

	public async stimulateForearm(side: 'left' | 'right'){
		if (side == 'left') {
			await this.arm.moveTo({ x: 200, y: -300, z: -50, spd: 0.3 })
			await this.arm.moveTo({ x: 200, y: -300, z: -110, spd: 0.1 })
			await this.arm.moveTo({ x: 250, y: -280, z: -110, spd: 0.1 })
			await this.arm.moveTo({ x: 250, y: -280, z: -50, spd: 0.1 })
			await this.arm.moveTo({ x: 200, y: -300, z: -50, spd: 0.1 })
		}
	}
}

export interface StimulusController {
	stimulateForearm(side: 'left' | 'right'): Promise<void>
}

export type StimulusControllerConstructor = new (arm: RoboticArm) => StimulusController
