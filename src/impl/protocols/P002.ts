import {
    ProtocolRunner,
    ProtocolRunnerConstructor,
} from './AbstractProtocolRunner.js'
import AbstractProtocolRunner, {
    ProtocolRunnerConstructorOptions,
} from './AbstractProtocolRunner.js'

export default class P002
    extends AbstractProtocolRunner
    implements ProtocolRunner
{
    public static Class?: ProtocolRunnerConstructor
    private static readonly xdfRecordPath = '../data/P002'

    protected constructor(options: ProtocolRunnerConstructorOptions) {
        super(options)
    }

    public static async Create() {
        const options = await this.generateOptions(this.xdfRecordPath)
        return new (this.Class ?? this)(options)
    }

    protected async deliverRandomizedStimuli() {}
}
