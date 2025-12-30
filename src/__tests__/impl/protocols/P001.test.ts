import { test, assert } from '@neurodevs/node-tdd'

import AbstractProtocolRunner, {
    ProtocolRunner,
} from '../../../impl/protocols/AbstractProtocolRunner.js'
import P001 from '../../../impl/protocols/P001.js'
import FakeStimulusController from '../../../testDoubles/StimulusController/FakeStimulusController.js'
import AbstractPackageTest from '../../AbstractPackageTest.js'

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
        assert.isTrue(
            this.instance instanceof AbstractProtocolRunner,
            'Should extend AbstractProtocolRunner!'
        )
    }

    @test()
    protected static async callsStimulateForearmSixteenTimes() {
        await this.runProtocol()

        assert.isEqual(
            FakeStimulusController.callsToStimulateForearm.length,
            16,
            'Should call stimulateForearm 16 times!'
        )
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
