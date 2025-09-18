import { BiosensorDeviceFactory, DeviceStreamer } from "@neurodevs/node-biosensors"
import { XdfRecorder } from "@neurodevs/node-xdf"
import TactileStimulusController, { StimulusController } from "../TactileStimulusController"
import { ProtocolRunner } from "../../types"
import { EventMarkerOutlet, MarkerOutlet } from "@neurodevs/node-lsl"

export default abstract class AbstractProtocolRunner implements ProtocolRunner {
	protected controller: StimulusController
	protected xdfRecordPath: string

	private cgx!: DeviceStreamer
	private recorder!: XdfRecorder

	protected constructor(options: ProtocolRunnerConstructorOptions) {
		const { controller, cgx, recorder, xdfRecordPath } = options

		this.controller = controller
		this.cgx = cgx
		this.recorder = recorder
		this.xdfRecordPath = xdfRecordPath
	}

	public async run() {
		this.startXdfRecorder()

		await this.startStreamingOnDevices()
		await this.deliverRandomizedStimuli()

		this.stopXdfRecorder()

		await this.disconnectDevices()
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

	protected static BiosensorDeviceFactory() {
		return BiosensorDeviceFactory.Create()
	}
	
	protected static async EventMarkerOutlet() {
		return EventMarkerOutlet.Create()
	}
	
	protected static async TactileStimulusController() {
		return TactileStimulusController.Create()
	}
}

export interface ProtocolRunnerConstructorOptions {
	controller: StimulusController
	cgx: DeviceStreamer
	outlet: MarkerOutlet
	recorder: XdfRecorder
	xdfRecordPath: string
}