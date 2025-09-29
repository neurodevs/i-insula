import { test, assert } from '@sprucelabs/test-utils'
import P001 from '../../../modules/protocols/P001'
import AbstractPackageTest from '../../AbstractPackageTest'
import FakeStimulusController from '../../../testDoubles/StimulusController/FakeStimulusController'
import { ProtocolRunner } from "modules/protocols/AbstractProtocolRunner"
import AbstractProtocolRunner from '../../../modules/protocols/AbstractProtocolRunner'

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
	protected static async extendsAbstractProtocolRunner() {
		assert.isTrue(this.instance instanceof AbstractProtocolRunner, 'Should extend AbstractProtocolRunner!')
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

	private static runProtocol() {
		return this.instance.run()
	}

	private static async P001() {
		return P001.Create()
	}
}	