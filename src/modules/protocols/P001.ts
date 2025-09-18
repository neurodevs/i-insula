import { BiosensorDeviceFactory, DeviceStreamer } from "@neurodevs/node-biosensors"
import TactileStimulusController from "../TactileStimulusController"
import { ProtocolRunner, ProtocolRunnerConstructor } from "../../types"
import AbstractProtocolRunner, { ProtocolRunnerConstructorOptions } from "./AbstractProtocolRunner"
import { XdfRecorder } from "@neurodevs/node-xdf"

export default class P001 extends AbstractProtocolRunner implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor
	private static readonly xdfRecordPath = '../data/P001'

	protected readonly xdfRecordPath = P001.xdfRecordPath

	protected constructor(options: ProtocolRunnerConstructorOptions) {
		super(options)
	}

	public static async Create() {
		const factory = this.BiosensorDeviceFactory()

		const controller = await this.TactileStimulusController()
		const [cgx, recorder] = await factory.createDevice('Cognionics Quick-20r', {xdfRecordPath: this.xdfRecordPath}) as unknown as [DeviceStreamer, XdfRecorder]

		const options = { controller, cgx, recorder, xdfRecordPath: this.xdfRecordPath }

		return new (this.Class ?? this)(options)
	}

	protected async deliverRandomizedStimuli() {
		for (const side of this.randomizedSides) {
			await this.controller.stimulateForearm(side)
		}
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
