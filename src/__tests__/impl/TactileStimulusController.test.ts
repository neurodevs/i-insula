import { test, assert } from '@sprucelabs/test-utils'
import { StimulusController } from '../../impl/TactileStimulusController'
import { FakeRoboticArm } from '@neurodevs/node-robotic-arm'
import AbstractPackageTest from '../AbstractPackageTest'

export default class TactileStimulusControllerTest extends AbstractPackageTest {
	private static instance: StimulusController
	
	protected static async beforeEach() {
		await super.beforeEach()

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
	protected static async setsOriginOnRoboticArm() {
		assert.isEqualDeep(
			FakeRoboticArm.callsToConstructor[0]?.origin, 
			{ x: 200, y: 0, z: -50, spd: 0.3 }, 
			'Should set origin on robotic arm!'
		)
	}

	@test()
	protected static async stimulateForearmOnLeftCallsRoboticArm() {
		await this.stimulateForearm('left')

		assert.isEqualDeep(FakeRoboticArm.callsToMoveTo, [    
			{ x: 200, y: -300, z: -50, spd: 0.3 },
			{ x: 200, y: -300, z: -110, spd: 0.1 },
			{ x: 250, y: -280, z: -110, spd: 0.1 },
			{ x: 250, y: -280, z: -50, spd: 0.1 },
			{ x: 200, y: -300, z: -50, spd: 0.1 }
		], 'Did not call robotic arm as expected!')
	}

	@test()
	protected static async stimulateForearmOnRightCallsRoboticArm() {
		await this.stimulateForearm('right')

		assert.isEqualDeep(FakeRoboticArm.callsToMoveTo, [    
			{ x: 200, y: 300, z: -50, spd: 0.3 },
			{ x: 200, y: 300, z: -110, spd: 0.1 },
			{ x: 250, y: 280, z: -110, spd: 0.1 },
			{ x: 250, y: 280, z: -50, spd: 0.1 },
			{ x: 200, y: 300, z: -50, spd: 0.1 }
		], 'Did not call robotic arm as expected!')
	}


	@test()
	protected static async leftResetsToOriginAfterStimulation() {
		await this.stimulateForearm('left')

		assert.isEqual(
			FakeRoboticArm.numCallsToResetToOrigin,
			1,
			'Should reset to origin after left stimulation!'
		)
	}

	@test()
	protected static async rightResetsToOriginAfterStimulation() {
		await this.stimulateForearm('right')

		assert.isEqual(
			FakeRoboticArm.numCallsToResetToOrigin,
			1,
			'Should reset to origin after right stimulation!'
		)
	}

	@test()
	protected static async disconnectCallsDisconnectOnRoboticArm() {
		await this.instance.disconnect()

		assert.isEqual(FakeRoboticArm.numCallsToDisconnect, 1, 'Should call disconnect on WaveshareRoboticArm!')
	}

	private static async stimulateForearm(side: 'left' | 'right') {
		await this.instance.stimulateForearm(side)
	}
}