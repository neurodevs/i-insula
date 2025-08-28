import { CgxDeviceStreamer } from "@neurodevs/node-biosensors"
import TactileStimulusController, { StimulusController } from "../modules/TactileStimulusController"

export default class P001 implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor

	private controller: StimulusController

	protected constructor(controller: StimulusController) {
		this.controller = controller
	}

	public static async Create() {
		const controller = await this.TactileStimulusController()
		await CgxDeviceStreamer.Create()
			
		return new (this.Class ?? this)(controller)
	}

	public async run() {
		const sides = [
			...Array(8).fill('left'),
			...Array(8).fill('right'),
		]

		for (let i = sides.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[sides[i], sides[j]] = [sides[j], sides[i]]
		}

		for (const side of sides) {
			await this.controller.stimulateForearm(side)
		}
	}

	private static TactileStimulusController() {
		return TactileStimulusController.Create()
	}
}

export interface ProtocolRunner {
	run(): Promise<void>
}

export type ProtocolRunnerConstructor = new (controller: StimulusController) => ProtocolRunner