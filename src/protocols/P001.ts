import { CgxDeviceStreamer, DeviceStreamer } from "@neurodevs/node-biosensors"
import TactileStimulusController, { StimulusController } from "../modules/TactileStimulusController"

export default class P001 implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor

	private controller: StimulusController
	private cgx: DeviceStreamer

	protected constructor(controller: StimulusController, cgx: DeviceStreamer) {
		this.controller = controller
		this.cgx = cgx
	}

	public static async Create() {
		const controller = await this.TactileStimulusController()
		const cgx = await this.CgxDeviceStreamer()

		return new (this.Class ?? this)(controller, cgx)
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

		await this.cgx.startStreaming()

		for (const side of sides) {
			await this.controller.stimulateForearm(side)
		}
	}

	private static TactileStimulusController() {
		return TactileStimulusController.Create()
	}

	private static async CgxDeviceStreamer() {
		return CgxDeviceStreamer.Create()
	}
}

export interface ProtocolRunner {
	run(): Promise<void>
}

export type ProtocolRunnerConstructor = new (controller: StimulusController) => ProtocolRunner