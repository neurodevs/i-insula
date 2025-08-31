import { BiosensorDeviceFactory, DeviceFactory, DeviceStreamer } from "@neurodevs/node-biosensors"
import TactileStimulusController, { StimulusController } from "../modules/TactileStimulusController"

export default class P001 implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor

	private controller: StimulusController
	private factory: DeviceFactory

	private cgx!: DeviceStreamer

	protected constructor(controller: StimulusController, factory: DeviceFactory) {
		this.controller = controller
		this.factory = factory
	}

	public static async Create() {
		const controller = await this.TactileStimulusController()
		const factory = this.BiosensorDeviceFactory()

		return new (this.Class ?? this)(controller, factory)
	}


	public async run() {
		this.cgx = await this.factory.createDevice('Cognionics Quick-20r')

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

	private static BiosensorDeviceFactory() {
		return BiosensorDeviceFactory.Create()
	}
}

export interface ProtocolRunner {
	run(): Promise<void>
}

export type ProtocolRunnerConstructor = new (controller: StimulusController) => ProtocolRunner