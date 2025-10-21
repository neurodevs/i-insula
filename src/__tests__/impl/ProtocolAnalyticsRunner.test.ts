import { test, assert } from '@sprucelabs/test-utils'
import ProtocolAnalyticsRunner, { AnalyticsRunner } from '../../impl/ProtocolAnalyticsRunner'
import { FakeLslInlet } from '@neurodevs/node-lsl'
import AbstractPackageTest from '../AbstractPackageTest'
import { DeviceStreamer } from '@neurodevs/node-biosensors'

export default class ProtocolAnalyticsRunnerTest extends AbstractPackageTest {
	private static instance: AnalyticsRunner
	private static devices: DeviceStreamer[]

	protected static async beforeEach() {
		await super.beforeEach()

		this.devices = await this.createDevices()
		
		this.instance = this.ProtocolAnalyticsRunner()
	}
	
	@test()
	protected static async createsInstance() {
		assert.isTruthy(this.instance, 'Failed to create instance!')
	}

	@test()
	protected static async createsCorrectNumberOfLslInlets() {
		assert.isEqual(FakeLslInlet.callsToConstructor.length, this.numTotalOutlets, `Created incorrect number of LslInlet instances!`)
	}

	private static async createDevices() {
		return [
			await this.CgxDeviceStreamer()
		]
	}

	private static get numTotalOutlets() {
		return this.devices.reduce((total, device) => total + device.outlets.length, 0)
	}

	private static get options() {
		return { devices: this.devices }
	}

	private static ProtocolAnalyticsRunner() {
		return ProtocolAnalyticsRunner.Create(this.options)
	}
}