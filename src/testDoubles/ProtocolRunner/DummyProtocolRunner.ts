import AbstractProtocolRunner, { ProtocolRunnerConstructorOptions } from '../../modules/protocols/AbstractProtocolRunner';
import { ProtocolRunner } from "modules/protocols/AbstractProtocolRunner";

export default class DummyProtocolRunner extends AbstractProtocolRunner implements ProtocolRunner {
    public constructor(options: ProtocolRunnerConstructorOptions) {
        super(options)
    }

    protected async deliverRandomizedStimuli() { }
}
