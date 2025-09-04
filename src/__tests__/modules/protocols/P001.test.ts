import { test, assert } from '@sprucelabs/test-utils'
import P001, { ProtocolRunner } from '../../../modules/protocols/P001'
import AbstractPackageTest from '../../AbstractPackageTest'
import FakeStimulusController from '../../../testDoubles/FakeStimulusController'
import { FakeCgxDeviceStreamer, FakeDeviceFactory } from '@neurodevs/node-biosensors'
import { FakeXdfRecorder } from '@neurodevs/node-xdf'

export default class P001Test extends AbstractPackageTest {
	private static instance: ProtocolRunner
	
	protected static async beforeEach() {
		await super.beforeEach()

		this.setFakeStimulusController()

		this.instance = await this.P001()
	}
	
	@test()
	protected static async createsInstance() {
		assert.isTruthy(this.instance, 'Should create an instance!')
	}

	@test()
	protected static async createsTactileStimulusController() {
		assert.isEqual(FakeStimulusController.callsToConstructor.length, 1, 'Should create a TactileStimulusController!')
	}

	@test()
	protected static async createsBiosensorDeviceFactory() {
		assert.isEqual(FakeDeviceFactory.numCallsToConstructor, 1, 'Should create a BiosensorDeviceFactory!')
	}

	@test()
	protected static async factoryCreatesBiosensorDevices() {
		await this.runProtocol()

		assert.isEqual(FakeDeviceFactory.callsToCreateDevice[0]?.name, 'Cognionics Quick-20r', 'Factory should create a Cognionics Quick-20r device!')
	}

	@test()
	protected static async passesXdfRecordPathToFactory() {
		await this.runProtocol()

		assert.isEqual(FakeDeviceFactory.callsToCreateDevice[0]?.options?.xdfRecordPath, this.xdfRecordPath, 'Factory received incorrect path!')
	}

	@test()
	protected static async callsStartOnXdfRecorder() {
		await this.runProtocol()

		assert.isEqual(FakeXdfRecorder.numCallsToStart, 1, 'Should call start on XdfRecorder!')
	}

	@test()
	protected static async callsStimulateForearmSixteenTimes() {
		await this.runProtocol()

		assert.isEqual(FakeStimulusController.callsToStimulateForearm.length, 16, 'Should call stimulateForearm 16 times!')
	}

	@test()
	protected static async halfCallsAreToLeftSide() {
		await this.runProtocol()

		const leftCalls = FakeStimulusController.callsToStimulateForearm.filter(
			(call) => call === 'left'
		).length

		assert.isEqual(leftCalls, 8, 'Should call left exactly 8 times!')
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
		FakeDeviceFactory.fakeDevice.startStreaming = async () => {
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
	protected static async callsDisconnectOnStimulusController() {
		await this.runProtocol()

		assert.isEqual(FakeStimulusController.numCallsToDisconnect, 1, 'Should call disconnect on TactileStimulusController!')
	}

	@test()
	protected static async callsDisconnectOnCgxDeviceStreamer() {
		await this.runProtocol()

		assert.isEqual(FakeCgxDeviceStreamer.numCallsToDisconnect, 1, 'Should call disconnect on CgxDeviceStreamer!')
	}

	private static runProtocol() {
		return this.instance.run()
	}

	private static readonly xdfRecordPath = '../data/P001'

	private static async P001() {
		return P001.Create()
	}
}	