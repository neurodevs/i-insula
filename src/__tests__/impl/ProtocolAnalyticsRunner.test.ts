import { DeviceStreamer } from '@neurodevs/node-biosensors'
import { FakeStreamInlet } from '@neurodevs/node-lsl'
import { test, assert } from '@neurodevs/node-tdd'

import AbstractPackageTest from '../AbstractPackageTest.js'
import ProtocolAnalyticsRunner, { AnalyticsRunner } from '../../impl/ProtocolAnalyticsRunner.js'

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
		assert.isEqual(FakeStreamInlet.callsToConstructor.length, this.numTotalOutlets, `Created incorrect number of LslInlet instances!`)
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