import { RoboticArm, WaveshareRoboticArm } from "@neurodevs/node-robotic-arm"

export default class TactileStimulusController implements StimulusController {
	public static Class?: StimulusControllerConstructor

	private arm: RoboticArm

	protected constructor(arm: RoboticArm) {
		this.arm = arm
	}

	public static async Create() {
		const arm = await this.WaveshareRoboticArm()
		return new (this.Class ?? this)(arm)
	}

	public async stimulateForearm(side: 'left' | 'right'){
		if (side == 'left') {
			await this.arm.moveTo({ x: 200, y: -300, z: -50, spd: 0.3 })
			await this.arm.moveTo({ x: 200, y: -300, z: -110, spd: 0.1 })
			await this.arm.moveTo({ x: 250, y: -280, z: -110, spd: 0.1 })
			await this.arm.moveTo({ x: 250, y: -280, z: -50, spd: 0.1 })
			await this.arm.moveTo({ x: 200, y: -300, z: -50, spd: 0.1 })
		} else {
			await this.arm.moveTo({ x: 200, y: 300, z: -50, spd: 0.3 })
			await this.arm.moveTo({ x: 200, y: 300, z: -110, spd: 0.1 })
			await this.arm.moveTo({ x: 250, y: 280, z: -110, spd: 0.1 })
			await this.arm.moveTo({ x: 250, y: 280, z: -50, spd: 0.1 })
			await this.arm.moveTo({ x: 200, y: 300, z: -50, spd: 0.1 })
		}
		await this.arm.resetToOrigin()
	}

	public async disconnect() {
		await this.arm.disconnect()
	}

	private static WaveshareRoboticArm() {
		return WaveshareRoboticArm.Create({
			origin: { x: 200, y: 0, z: -50, spd: 0.3 },
		})
	}
}

export interface StimulusController {
	stimulateForearm(side: 'left' | 'right'): Promise<void>
	disconnect(): Promise<void>
}

export type StimulusControllerConstructor = new (arm: RoboticArm) => StimulusController
