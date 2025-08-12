import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import TactileStimulusController, { StimulusController } from '../modules/TactileStimulusController'
import { FakeAxios, FakeRoboticArm, WaveshareRoboticArm } from '@neurodevs/node-robotic-arm'
import type { AxiosStatic } from 'axios'

export default class TactileStimulusControllerTest extends AbstractSpruceTest {
	private static instance: StimulusController
	
	protected static async beforeEach() {
		await super.beforeEach()

		WaveshareRoboticArm.axios = new FakeAxios() as unknown as AxiosStatic

		this.setFakeRoboticArm()

		this.instance = await this.TactileStimulusController()
	}

	@test()
	protected static async createsInstance() {
		assert.isTruthy(this.instance, 'Should create an instance!')
	}

	@test()
	protected static async createsWaveshareRoboticArm() {
		assert.isEqual(FakeRoboticArm.callsToConstructor.length, 1, 'Should create a WaveshareRoboticArm instance!')
	}

	private static setFakeRoboticArm() {
		WaveshareRoboticArm.Class = FakeRoboticArm
		FakeRoboticArm.resetTestDouble()
	}
	
	private static async TactileStimulusController() {
		return await TactileStimulusController.Create()
	}
}