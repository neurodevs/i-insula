import { test, assert } from '@sprucelabs/test-utils'
import P001, { ProtocolRunner } from '../../protocols/P001'
import AbstractPackageTest from '../AbstractPackageTest'
import FakeStimulusController from '../../testDoubles/FakeStimulusController'

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

	private static async P001() {
		return P001.Create()
	}
}