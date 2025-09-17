import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import ProtocolAnalyticsRunner, { AnalyticsRunner } from '../../modules/ProtocolAnalyticsRunner'

export default class ProtocolAnalyticsRunnerTest extends AbstractSpruceTest {
	private static instance: AnalyticsRunner
	
	protected static async beforeEach() {
		await super.beforeEach()
		
		this.instance = this.ProtocolAnalyticsRunner()
	}
	
	@test()
	protected static async createsInstance() {
		assert.isTruthy(this.instance, 'Failed to create instance!')
	}
	
	private static ProtocolAnalyticsRunner() {
		return ProtocolAnalyticsRunner.Create()
	}
}