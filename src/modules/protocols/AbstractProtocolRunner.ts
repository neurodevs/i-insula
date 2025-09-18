import { BiosensorDeviceFactory, DeviceStreamer } from "@neurodevs/node-biosensors"
import { XdfRecorder } from "@neurodevs/node-xdf"
import TactileStimulusController, { StimulusController } from "../TactileStimulusController"
import { ProtocolRunner } from "../../types"
import { EventMarkerOutlet, MarkerOutlet } from "@neurodevs/node-lsl"

export default abstract class AbstractProtocolRunner implements ProtocolRunner {
	protected controller: StimulusController
	protected outlet: MarkerOutlet
	protected xdfRecordPath: string

	private cgx!: DeviceStreamer
	private recorder!: XdfRecorder

	protected constructor(options: ProtocolRunnerConstructorOptions) {
		const { controller, cgx, outlet, recorder, xdfRecordPath } = options

		this.controller = controller
		this.cgx = cgx
		this.outlet = outlet
		this.recorder = recorder
		this.xdfRecordPath = xdfRecordPath
	}

	public async run() {
		this.startXdfRecorder()

		this.outlet.pushMarker('session-begin')

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

	protected static async generateOptions(xdfRecordPath: string) {
		const factory = this.BiosensorDeviceFactory()

		const controller = await this.TactileStimulusController()
		const [cgx, recorder] = await factory.createDevice('Cognionics Quick-20r', { xdfRecordPath }) as unknown as [DeviceStreamer, XdfRecorder]
		const outlet = await this.EventMarkerOutlet()

		return { controller, cgx, outlet, recorder, xdfRecordPath }
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