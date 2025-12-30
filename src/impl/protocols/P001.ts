import { ProtocolRunnerConstructor } from './AbstractProtocolRunner.js'
import AbstractProtocolRunner, {
    ProtocolRunnerConstructorOptions,
} from './AbstractProtocolRunner.js'

export default class P001 extends AbstractProtocolRunner {
    public static Class?: ProtocolRunnerConstructor
    private static readonly xdfRecordPath = '../data/P001'

    protected constructor(options: ProtocolRunnerConstructorOptions) {
        super(options)
    }

    public static async Create() {
        const options = await this.generateOptions(this.xdfRecordPath)
        return new (this.Class ?? this)(options)
    }

    protected async deliverRandomizedStimuli() {
        for (const side of this.randomizedSides) {
            await this.controller.stimulateForearm(side)
        }
    }

    private get randomizedSides() {
        return [...Array(8).fill('left'), ...Array(8).fill('right')].sort(
            () => Math.random() - 0.5
        )
    }
}
