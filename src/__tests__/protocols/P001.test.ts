import { test, assert } from '@sprucelabs/test-utils'
import P001, { ProtocolRunner } from '../../protocols/P001'
import AbstractPackageTest from '../AbstractPackageTest'
import FakeStimulusController from '../../testDoubles/FakeStimulusController'
import { FakeCgxDeviceStreamer } from '@neurodevs/node-biosensors'

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
	protected static async createsCgxDeviceStreamer() {
		assert.isEqual(FakeCgxDeviceStreamer.callsToConstructor.length, 1, 'Should create a CgxDeviceStreamer!')
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

	private static runProtocol() {
		return this.instance.run()
	}


	private static async P001() {
		return P001.Create()
	}
}	