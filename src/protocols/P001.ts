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
		await this.cgx.startStreaming()

		for (const side of this.randomizedSides) {
			await this.controller.stimulateForearm(side)
		}

		await this.controller.disconnect()
		await this.cgx.disconnect()
	}

	private get randomizedSides() {
		return [...Array(8).fill('left'), ...Array(8).fill('right')].sort(() => Math.random() - 0.5)
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