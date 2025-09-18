import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractPackageTest from '../../AbstractPackageTest'
import { ProtocolRunner } from '../../../types'
import DummyProtocolRunner from '../../../testDoubles/ProtocolRunner/DummyProtocolRunner'
import { FakeXdfRecorder } from '@neurodevs/node-xdf'
import { FakeCgxDeviceStreamer } from '@neurodevs/node-biosensors'
import FakeStimulusController from '../../../testDoubles/StimulusController/FakeStimulusController'
import { FakeMarkerOutlet } from '@neurodevs/node-lsl'

export default class AbstractProtocolRunnerTest extends AbstractPackageTest {
	private static instance: ProtocolRunner

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
	protected static async sendsSessionBeginEventMarker() {
		await this.runProtocol()

		assert.isEqualDeep(FakeMarkerOutlet.callsToPushMarker[0], 'session-begin', 'Incorrect event marker!')
	}

	@test()
	protected static async callsStartOnXdfStreamRecorder() {
		await this.runProtocol()

		assert.isEqual(FakeXdfRecorder.numCallsToStart, 1, 'Should call start on XdfRecorder!')
	}

	@test()
	protected static async callsStartStreamingOnCgxDeviceStreamer() {
		await this.runProtocol()

		assert.isEqual(FakeCgxDeviceStreamer.numCallsToStartStreaming, 1, 'Should call startStreaming on CgxDeviceStreamer!')
	}

	@test()
	protected static async callsStartStreamingBeforeStimulations() {
		const orderedCalls: string[] = []

		//@ts-ignore
		this.instance.cgx.startStreaming = async () => {
			orderedCalls.push('startStreaming')
		}

		//@ts-ignore
		this.instance.controller.stimulateForearm = async (side: 'left' | 'right') => {
			orderedCalls.push(side)
		}

		await this.runProtocol()

		assert.isEqual(orderedCalls[0], 'startStreaming', 'Should call startStreaming before any stimulation!')
	}
	
	@test()
	protected static async callsStopOnXdfStreamRecorder() {
		await this.runProtocol()

		assert.isEqual(FakeXdfRecorder.numCallsToStop, 1, 'Should call stop on XdfRecorder!')
	}

	@test()
	protected static async callsDisconnectOnTactileStimulusController() {
		await this.runProtocol()

		assert.isEqual(FakeStimulusController.numCallsToDisconnect, 1, 'Should call disconnect on TactileStimulusController!')
	}

	@test()
	protected static async callsDisconnectOnCgxDeviceStreamer() {
		await this.runProtocol()

		assert.isEqual(FakeCgxDeviceStreamer.numCallsToDisconnect, 1, 'Should call disconnect on CgxDeviceStreamer!')
	}


	private static async runProtocol() {
		await this.instance.run()
	}

	private static xdfRecordPath = generateId()

	private static async DummyProtocolRunner() {
		return new DummyProtocolRunner({
			'cgx': await this.CgxDeviceStreamer(),
			'controller': await this.TactileStimulusController(),
			'outlet': new FakeMarkerOutlet(),
			'recorder': new FakeXdfRecorder(),
			'xdfRecordPath': this.xdfRecordPath
		})
	}
}

