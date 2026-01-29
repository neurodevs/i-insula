import generateId from '@neurodevs/generate-id'
import { FakeCgxDeviceStreamer } from '@neurodevs/node-biosensors'
import { FakeEventMarkerEmitter } from '@neurodevs/node-lsl'
import { test, assert } from '@neurodevs/node-tdd'
import { FakeXdfRecorder } from '@neurodevs/node-xdf'

import AbstractProtocolRunner, {
    ProtocolRunner,
} from '../../../impl/protocols/AbstractProtocolRunner.js'
import DummyProtocolRunner from '../../../testDoubles/ProtocolRunner/DummyProtocolRunner.js'
import { callsToSpeak } from '../../../testDoubles/say/fakeSpeak.js'
import FakeStimulusController from '../../../testDoubles/StimulusController/FakeStimulusController.js'
import AbstractPackageTest from '../../AbstractPackageTest.js'

export default class AbstractProtocolRunnerTest extends AbstractPackageTest {
    private static instance: ProtocolRunner

    protected static async beforeAll() {
        await super.beforeAll()

        assert.isEqual(
            AbstractProtocolRunner.baselineMs,
            300000,
            'Incorrect default baselineMs!'
        )
    }

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeStimulusController()

        this.instance = await this.DummyProtocolRunner()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Failed to create instance!')
    }

    @test()
    protected static async callsStartOnXdfStreamRecorder() {
        await this.runProtocol()

        assert.isEqual(
            FakeXdfRecorder.numCallsToStart,
            1,
            'Should call start on XdfRecorder!'
        )
    }

    @test()
    protected static async callsStartStreamingOnCgxDeviceStreamer() {
        await this.runProtocol()

        assert.isEqual(
            FakeCgxDeviceStreamer.numCallsToStartStreaming,
            1,
            'Should call startStreaming on CgxDeviceStreamer!'
        )
    }

    @test()
    protected static async callsStartStreamingBeforeStimulations() {
        const orderedCalls: string[] = []

        //@ts-ignore
        this.instance.cgx.startStreaming = async () => {
            orderedCalls.push('startStreaming')
        }

        //@ts-ignore
        this.instance.controller.stimulateForearm = async (
            side: 'left' | 'right'
        ) => {
            orderedCalls.push(side)
        }

        await this.runProtocol()

        assert.isEqual(
            orderedCalls[0],
            'startStreaming',
            'Should call startStreaming before any stimulation!'
        )
    }

    @test()
    protected static async pushesSessionBeginEventMarker() {
        await this.runProtocol()

        assert.isEqualDeep(
            FakeEventMarkerEmitter.callsToEmit[0].markerName,
            'session-begin',
            'Incorrect event marker!'
        )
    }

    @test()
    protected static async pushesPreBaselineBeginEventMarker() {
        await this.runProtocol()

        assert.isEqualDeep(
            FakeEventMarkerEmitter.callsToEmit[1].markerName,
            'pre-baseline-begin',
            'Incorrect event marker!'
        )
    }

    @test()
    protected static async speaksThePreBaselineScript() {
        await this.runProtocol()

        assert.isEqualDeep(
            callsToSpeak[0]?.text,
            'Pre-trial baseline begins...',
            'Incorrect text to speak!'
        )
    }

    @test()
    protected static async finishesPreBaselineWithTheWordNow() {
        await this.runProtocol()

        const callback = callsToSpeak[0]?.callback
        callback?.('')

        assert.isEqualDeep(
            callsToSpeak[1]?.text,
            'Now.',
            'Incorrect text to speak!'
        )
    }

    @test()
    protected static async waitsForThePreBaselinePeriod() {
        AbstractProtocolRunner.baselineMs = this.waitMs

        let t0: number | undefined
        let t1: number | undefined

        //@ts-ignore
        this.instance.emitter.emit = async (markerName: string) => {
            if (markerName === 'pre-baseline-begin') {
                t0 = Date.now()
            } else if (markerName === 'pre-baseline-end') {
                t1 = Date.now()
            }
        }

        await this.runProtocol()

        assert.isAbove(
            (t1 ?? 0) - (t0 ?? 0),
            9,
            `Did not wait at least ${this.waitMs}ms during pre-baseline period!`
        )
    }

    @test()
    protected static async speaksThatPreBaselineIsDone() {
        await this.runProtocol()

        assert.isEqualDeep(
            callsToSpeak[2]?.text,
            'Pre-trial baseline is done.',
            'Incorrect text to speak!'
        )
    }

    @test()
    protected static async pushesPreBaselineEndEventMarker() {
        await this.runProtocol()

        assert.isEqualDeep(
            FakeEventMarkerEmitter.callsToEmit[2].markerName,
            'pre-baseline-end',
            'Incorrect event marker!'
        )
    }

    @test()
    protected static async pushesPostBaselineBeginEventMarker() {
        await this.runProtocol()

        assert.isEqualDeep(
            FakeEventMarkerEmitter.callsToEmit[3].markerName,
            'post-baseline-begin',
            'Incorrect event marker!'
        )
    }

    @test()
    protected static async speaksThePostBaselineScript() {
        await this.runProtocol()

        assert.isEqualDeep(
            callsToSpeak[3]?.text,
            'Post-trial baseline begins...',
            'Incorrect text to speak!'
        )
    }

    @test()
    protected static async finishesPostBaselineWithTheWordNow() {
        await this.runProtocol()

        const callback = callsToSpeak[3]?.callback
        callback?.('')

        assert.isEqualDeep(
            callsToSpeak[4]?.text,
            'Now.',
            'Incorrect text to speak!'
        )
    }

    @test()
    protected static async waitsForThePostBaselinePeriod() {
        AbstractProtocolRunner.baselineMs = this.waitMs

        let t0: number | undefined
        let t1: number | undefined

        //@ts-ignore
        this.instance.emitter.emit = async (markerName: string) => {
            if (markerName === 'post-baseline-begin') {
                t0 = Date.now()
            } else if (markerName === 'post-baseline-end') {
                t1 = Date.now()
            }
        }

        await this.runProtocol()

        assert.isAbove(
            (t1 ?? 0) - (t0 ?? 0),
            9,
            `Did not wait at least ${this.waitMs}ms during post-baseline period!`
        )
    }

    @test()
    protected static async speaksThatPostBaselineIsDone() {
        await this.runProtocol()

        assert.isEqualDeep(
            callsToSpeak[5]?.text,
            'Post-trial baseline is done.',
            'Incorrect text to speak!'
        )
    }

    @test()
    protected static async pushesPostBaselineEndEventMarker() {
        await this.runProtocol()

        assert.isEqualDeep(
            FakeEventMarkerEmitter.callsToEmit[4].markerName,
            'post-baseline-end',
            'Incorrect event marker!'
        )
    }

    @test()
    protected static async pushesSessionEndEventMarker() {
        await this.runProtocol()

        assert.isEqualDeep(
            FakeEventMarkerEmitter.callsToEmit[5].markerName,
            'session-end',
            'Incorrect event marker!'
        )
    }

    @test()
    protected static async callsFinishOnXdfRecorder() {
        await this.runProtocol()

        assert.isEqual(
            FakeXdfRecorder.numCallsToFinish,
            1,
            'Should call finish on XdfRecorder!'
        )
    }

    @test()
    protected static async callsDisconnectOnTactileStimulusController() {
        await this.runProtocol()

        assert.isEqual(
            FakeStimulusController.numCallsToDisconnect,
            1,
            'Should call disconnect on TactileStimulusController!'
        )
    }

    @test()
    protected static async callsDisconnectOnCgxDeviceStreamer() {
        await this.runProtocol()

        assert.isEqual(
            FakeCgxDeviceStreamer.numCallsToDisconnect,
            1,
            'Should call disconnect on CgxDeviceStreamer!'
        )
    }

    @test()
    protected static async callsStartStreamingBeforePushingSessionBeginMarker() {
        const orderedCalls: string[] = []

        //@ts-ignore
        this.instance.cgx.startStreaming = async () => {
            orderedCalls.push('start-streaming')
        }

        //@ts-ignore
        this.instance.emitter.emit = async (marker: string) => {
            orderedCalls.push(marker)
        }

        await this.runProtocol()

        const startStreamingIndex = orderedCalls.indexOf('start-streaming')
        const sessionBeginIndex = orderedCalls.indexOf('session-begin')

        assert.isBelow(
            startStreamingIndex,
            sessionBeginIndex,
            'Wrong order of events!'
        )
    }

    private static async runProtocol() {
        await this.instance.run()
    }

    private static xdfRecordPath = generateId()
    private static waitMs = 10

    private static async DummyProtocolRunner() {
        return new DummyProtocolRunner({
            cgx: await this.CgxDeviceStreamer(),
            controller: await this.TactileStimulusController(),
            emitter: new FakeEventMarkerEmitter(),
            recorder: new FakeXdfRecorder(),
            xdfRecordPath: this.xdfRecordPath,
        })
    }
}
