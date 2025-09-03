import { BiosensorDeviceFactory, DeviceFactory, DeviceStreamer } from "@neurodevs/node-biosensors"
import TactileStimulusController, { StimulusController } from "../TactileStimulusController"

export default class P001 implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor

	private controller: StimulusController
	private factory: DeviceFactory

	private cgx!: DeviceStreamer

	private readonly xdfRecordPath = '../data/P001'

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
		await this.createBiosensorDevices()
		await this.startStreamingOnDevices()
		await this.deliverRandomizedStimuli()
		await this.disconnectDevices()
	}

	private async createBiosensorDevices() {
		this.cgx = await this.factory.createDevice('Cognionics Quick-20r', {xdfRecordPath: this.xdfRecordPath})
	}

	private async startStreamingOnDevices() {
		await this.cgx.startStreaming()
	}

	private async deliverRandomizedStimuli() {
		for (const side of this.randomizedSides) {
			await this.controller.stimulateForearm(side)
		}
	}


	private get randomizedSides() {
		return [...Array(8).fill('left'), ...Array(8).fill('right')].sort(() => Math.random() - 0.5)
	}

	private async disconnectDevices() {
		await this.controller.disconnect()
		await this.cgx.disconnect()
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