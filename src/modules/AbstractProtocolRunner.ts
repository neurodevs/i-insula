import { DeviceFactory, DeviceStreamer } from "@neurodevs/node-biosensors"
import { XdfRecorder } from "@neurodevs/node-xdf"
import { StimulusController } from "./TactileStimulusController"
import { ProtocolRunner } from "../types"

export default abstract class AbstractProtocolRunner implements ProtocolRunner {
	protected controller: StimulusController
	private factory: DeviceFactory
	protected xdfRecordPath: string

	private cgx!: DeviceStreamer
	private recorder!: XdfRecorder

	protected constructor(options: ProtocolRunnerConstructorOptions) {
		const { controller, factory, xdfRecordPath } = options

		this.controller = controller
		this.factory = factory
		this.xdfRecordPath = xdfRecordPath
	}

	public async run() {
		await this.createDevicesAndRecorder()
		
		this.startXdfRecorder()

		await this.startStreamingOnDevices()
		await this.deliverRandomizedStimuli()

		this.stopXdfRecorder()

		await this.disconnectDevices()
	}

	private async createDevicesAndRecorder() {
		[this.cgx, this.recorder] = await this.factory.createDevice('Cognionics Quick-20r', {xdfRecordPath: this.xdfRecordPath})
	}

	private startXdfRecorder() {
		this.recorder.start()
	}

	private async startStreamingOnDevices() {
		await this.cgx.startStreaming()
	}

	protected abstract deliverRandomizedStimuli(): Promise<void>

	private stopXdfRecorder() {
		this.recorder.stop()
	}

	private async disconnectDevices() {
		await this.controller.disconnect()
		await this.cgx.disconnect()
	}
}

export interface ProtocolRunnerConstructorOptions {
	controller: StimulusController
	factory: DeviceFactory
	xdfRecordPath: string
}