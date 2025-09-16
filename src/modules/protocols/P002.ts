import { BiosensorDeviceFactory, DeviceStreamer } from "@neurodevs/node-biosensors"
import TactileStimulusController from "../TactileStimulusController"
import { ProtocolRunner, ProtocolRunnerConstructor } from "../../types"
import AbstractProtocolRunner, { ProtocolRunnerConstructorOptions } from "../AbstractProtocolRunner"
import { XdfRecorder } from "@neurodevs/node-xdf"

export default class P002 extends AbstractProtocolRunner implements ProtocolRunner {
    public static Class?: ProtocolRunnerConstructor
    private static readonly xdfRecordPath = '../data/P002'

    protected readonly xdfRecordPath = P002.xdfRecordPath

    protected constructor(options: ProtocolRunnerConstructorOptions) {
        super(options)
    }

    public static async Create() {
        const factory = this.BiosensorDeviceFactory()

        const controller = await this.TactileStimulusController()
        const [cgx, recorder] = await factory.createDevice('Cognionics Quick-20r', {xdfRecordPath: this.xdfRecordPath}) as unknown as [DeviceStreamer, XdfRecorder]

        const options = { controller, cgx, recorder, xdfRecordPath: this.xdfRecordPath }

        return new (this.Class ?? this)(options)
    }

    protected async deliverRandomizedStimuli() {}

    private static TactileStimulusController() {
        return TactileStimulusController.Create()
    }

    private static BiosensorDeviceFactory() {
        return BiosensorDeviceFactory.Create()
    }
}
