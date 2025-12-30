import { assert, test } from '@neurodevs/node-tdd'

import AbstractProtocolRunner, {
    ProtocolRunner,
} from '../../../impl/protocols/AbstractProtocolRunner.js'
import P002 from '../../../impl/protocols/P002.js'
import AbstractPackageTest from '../../AbstractPackageTest.js'

export default class P002Test extends AbstractPackageTest {
    private static instance: ProtocolRunner

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeStimulusController()

        this.instance = await this.P002()
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

    protected static async P002() {
        return P002.Create()
    }
}
