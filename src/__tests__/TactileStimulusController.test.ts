import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import TactileStimulusController, { StimulusController } from '../modules/TactileStimulusController'

export default class TactileStimulusControllerTest extends AbstractSpruceTest {
	private static instance: StimulusController
	
	protected static async beforeEach() {
		await super.beforeEach()

		this.instance = this.TactileStimulusController()
	}
	
	@test()
	protected static async createsInstance() {
		assert.isTruthy(this.instance, 'Should create an instance!')
	}
	
	private static TactileStimulusController() {
		return TactileStimulusController.Create()
	}
}