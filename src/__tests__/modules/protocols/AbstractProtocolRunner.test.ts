import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractPackageTest from '../../AbstractPackageTest'
import { ProtocolRunner } from '../../../types'
import DummyProtocolRunner from '../../../testDoubles/ProtocolRunner/DummyProtocolRunner'
import { FakeXdfRecorder } from '@neurodevs/node-xdf'

export default class AbstractProtocolRunnerTest extends AbstractPackageTest {
	private static instance: ProtocolRunner

	protected static async beforeEach() {
		await super.beforeEach()
		
		this.instance = await this.DummyProtocolRunner()
	}
	
	@test()
	protected static async createsInstance() {
		assert.isTruthy(this.instance, 'Failed to create instance!')
	}

	private static xdfRecordPath = generateId()

	private static async DummyProtocolRunner() {
		return new DummyProtocolRunner({
			'cgx': await this.CgxDeviceStreamer(),
			'controller': await this.TactileStimulusController(),
			'recorder': new FakeXdfRecorder(),
			'xdfRecordPath': this.xdfRecordPath
		})
	}
}

