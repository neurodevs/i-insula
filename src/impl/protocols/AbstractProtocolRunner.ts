import {
    BiosensorDeviceFactory,
    DeviceStreamer,
} from '@neurodevs/node-biosensors'
import { LslEventMarkerEmitter, EventMarkerEmitter } from '@neurodevs/node-lsl'
import { XdfRecorder } from '@neurodevs/node-xdf'
import say from 'say'

import TactileStimulusController, {
    StimulusController,
} from '../TactileStimulusController.js'

export default abstract class AbstractProtocolRunner implements ProtocolRunner {
    public static baselineMs = 300000
    public static speak = say.speak
    protected controller: StimulusController
    protected emitter: EventMarkerEmitter
    protected xdfRecordPath: string

    private cgx!: DeviceStreamer
    private recorder!: XdfRecorder

    protected constructor(options: ProtocolRunnerConstructorOptions) {
        const { controller, cgx, emitter, recorder, xdfRecordPath } = options

        this.controller = controller
        this.cgx = cgx
        this.emitter = emitter
        this.recorder = recorder
        this.xdfRecordPath = xdfRecordPath
    }

    public async run() {
        await this.setup()
        await this.startSession()
        await this.teardown()
    }

    private async setup() {
        this.startXdfRecorder()
        await this.startStreamingOnDevices()
    }

    private startXdfRecorder() {
        this.recorder.start()
    }

    private async startStreamingOnDevices() {
        await this.cgx.startStreaming()
    }

    private async startSession() {
        await this.emit('session-begin')

        await this.startPreBaseline()
        await this.deliverRandomizedStimuli()
        await this.startPostBaseline()

        await this.emit('session-end')
    }

    private emit(markerName: string) {
        return this.emitter.emit(markerName)
    }

    private async startPreBaseline() {
        await this.emit('pre-baseline-begin')

        this.speakPreBaselineBefore()
        await this.waitForBaselineMs()
        this.speakPreBaselineAfter()

        await this.emit('pre-baseline-end')
    }

    private speakPreBaselineBefore() {
        this.speak('Pre-trial baseline begins...', undefined, undefined, () => {
            this.speak('Now.')
        })
    }

    private async waitForBaselineMs() {
        await new Promise((r) =>
            setTimeout(r, AbstractProtocolRunner.baselineMs)
        )
    }

    private speakPreBaselineAfter() {
        this.speak('Pre-trial baseline is done.')
    }

    protected abstract deliverRandomizedStimuli(): Promise<void>

    private async startPostBaseline() {
        await this.emit('post-baseline-begin')

        this.speakPostBaselineBefore()
        await this.waitForBaselineMs()
        this.speakPostBaselineAfter()

        await this.emit('post-baseline-end')
    }

    private speakPostBaselineBefore() {
        this.speak(
            'Post-trial baseline begins...',
            undefined,
            undefined,
            () => {
                this.speak('Now.')
            }
        )
    }

    private speakPostBaselineAfter() {
        this.speak('Post-trial baseline is done.')
    }

    private async teardown() {
        this.finishXdfRecorder()
        await this.disconnectAll()
    }

    private finishXdfRecorder() {
        this.recorder.finish()
    }

    private async disconnectAll() {
        await this.controller.disconnect()
        await this.cgx.disconnect()
    }

    private get speak() {
        return AbstractProtocolRunner.speak
    }

    protected static async generateOptions(
        xdfRecordPath: string
    ): Promise<ProtocolRunnerConstructorOptions> {
        const factory = this.BiosensorDeviceFactory()

        const controller = await this.TactileStimulusController()
        const emitter = await this.LslEventMarkerEmitter()

        const { device: cgx, recorder } = await factory.createDevice(
            'Cognionics Quick-20r',
            { xdfRecordPath }
        )

        return { controller, cgx, emitter, recorder: recorder!, xdfRecordPath }
    }

    protected static BiosensorDeviceFactory() {
        return BiosensorDeviceFactory.Create()
    }

    protected static async LslEventMarkerEmitter() {
        return LslEventMarkerEmitter.Create()
    }

    protected static async TactileStimulusController() {
        return TactileStimulusController.Create()
    }
}

export interface ProtocolRunner {
    run(): Promise<void>
}

export type ProtocolRunnerConstructor = new (
    options: ProtocolRunnerConstructorOptions
) => ProtocolRunner

export interface ProtocolRunnerConstructorOptions {
    controller: StimulusController
    cgx: DeviceStreamer
    emitter: EventMarkerEmitter
    recorder: XdfRecorder
    xdfRecordPath: string
}
