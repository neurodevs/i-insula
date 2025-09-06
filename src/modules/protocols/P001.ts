import { BiosensorDeviceFactory } from "@neurodevs/node-biosensors"
import TactileStimulusController from "../TactileStimulusController"
import { ProtocolRunner, ProtocolRunnerConstructor } from "../../types"
import AbstractProtocolRunner, { ProtocolRunnerConstructorOptions } from "../AbstractProtocolRunner"

export default class P001 extends AbstractProtocolRunner implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor
	private static readonly xdfRecordPath = '../data/P001'

	protected readonly xdfRecordPath = P001.xdfRecordPath

	protected constructor(options: ProtocolRunnerConstructorOptions) {
		super(options)
	}

	public static async Create() {
		const controller = await this.TactileStimulusController()
		const factory = this.BiosensorDeviceFactory()

		const options = { controller, factory, xdfRecordPath: this.xdfRecordPath }
		
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
