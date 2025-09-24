import { BiosensorDeviceFactory, DeviceStreamer } from "@neurodevs/node-biosensors"
import { XdfRecorder } from "@neurodevs/node-xdf"
import TactileStimulusController, { StimulusController } from "../TactileStimulusController"
import { ProtocolRunner } from "../../types"
import { EventMarkerOutlet, MarkerOutlet } from "@neurodevs/node-lsl"
import say from "say"

export default abstract class AbstractProtocolRunner implements ProtocolRunner {
	public static baselineMs = 300000
	public static waitMs = 10
	public static speak = say.speak
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

		await this.startStreamingOnDevices()
		await this.pushSessionBeginMarker()
		
		await this.speakPreBaselineScript()
		await this.deliverRandomizedStimuli()
		await this.speakPostBaselineScript()

		this.pushSessionEndMarker()

		this.stopXdfRecorder()

		await this.disconnectAll()
	}

	private startXdfRecorder() {
		this.recorder.start()
	}

	private async startStreamingOnDevices() {
		await this.cgx.startStreaming()
	}
	
	private async pushSessionBeginMarker() {
		await this.waitForRecorderToFullyStart()
		this.pushMarker('session-begin')
	}

	private async waitForRecorderToFullyStart() {
		await new Promise(r => setTimeout(r, AbstractProtocolRunner.waitMs))
	}

	private async speakPreBaselineScript() {
		this.pushMarker('pre-baseline-begin')

		this.speak('Pre-trial baseline begins...', undefined, undefined, () => {
			this.speak('Now.')
		})

		await this.waitForBaselineMs()

		this.speak('Pre-trial baseline is done.')

		this.pushMarker('pre-baseline-end')
	}

	private async waitForBaselineMs() {
		await new Promise(r => setTimeout(r, AbstractProtocolRunner.baselineMs))
	}

	protected abstract deliverRandomizedStimuli(): Promise<void>

	private async speakPostBaselineScript() {
		this.pushMarker('post-baseline-begin')

		this.speak('Post-trial baseline begins...', undefined, undefined, () => {
			this.speak('Now.')
		})

		await this.waitForBaselineMs()

		this.pushMarker('post-baseline-end')
	}

	private pushSessionEndMarker() {
		this.pushMarker('session-end')
	}

	private stopXdfRecorder() {
		this.recorder.stop()
	}

	private async disconnectAll() {
		await this.controller.disconnect()
		await this.cgx.disconnect()
	}

	private pushMarker(markerName: string) {
		return this.outlet.pushMarker(markerName)
	}

	private get speak() {
		return AbstractProtocolRunner.speak
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