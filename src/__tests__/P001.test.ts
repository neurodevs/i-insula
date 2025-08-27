import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import P001, { ProtocolRunner } from '../modules/P001'

export default class P001Test extends AbstractSpruceTest {
	private static instance: ProtocolRunner
	
	protected static async beforeEach() {
		await super.beforeEach()
		
		this.instance = this.P001()
	}
	
	@test()
	protected static async createsInstance() {
		assert.isTruthy(this.instance, 'Should create an instance!')
	}
	
	private static P001() {
		return P001.Create()
	}
}