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

	@test()
	protected static async stimulateForearmOnLeftCallsRoboticArm() {
		await this.instance.stimulateForearm('left')

		assert.isEqualDeep(FakeRoboticArm.callsToMoveTo, [    
			{ x: 200, y: -300, z: -50, spd: 0.3 },
			{ x: 200, y: -300, z: -110, spd: 0.1 },
			{ x: 250, y: -280, z: -110, spd: 0.1 },
			{ x: 250, y: -280, z: -50, spd: 0.1 },
			{ x: 200, y: -300, z: -50, spd: 0.1 }
		], 'Did not call robotic arm as expected!')

	}

	private static setFakeRoboticArm() {
		WaveshareRoboticArm.Class = FakeRoboticArm
		FakeRoboticArm.resetTestDouble()
	}
	
	private static async TactileStimulusController() {
		return await TactileStimulusController.Create()
	}
}