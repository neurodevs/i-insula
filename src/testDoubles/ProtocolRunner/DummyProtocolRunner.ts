import AbstractProtocolRunner, { ProtocolRunner, ProtocolRunnerConstructorOptions } from '../../impl/protocols/AbstractProtocolRunner.js'

export default class DummyProtocolRunner extends AbstractProtocolRunner implements ProtocolRunner {
    public constructor(options: ProtocolRunnerConstructorOptions) {
        super(options)
    }

    protected async deliverRandomizedStimuli() { }
}
