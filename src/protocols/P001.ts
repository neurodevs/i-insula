import TactileStimulusController, { StimulusController } from "../modules/TactileStimulusController"

export default class P001 implements ProtocolRunner {
	public static Class?: ProtocolRunnerConstructor

	private controller: StimulusController

	protected constructor(controller: StimulusController) {
		this.controller = controller
	}

	public static async Create() {
		const controller = await this.TactileStimulusController()
		return new (this.Class ?? this)(controller)
	}

	public async run() {
		for (let i = 0; i < 16; i++) {
			await this.controller.stimulateForearm('left')
		}
	}

	private static TactileStimulusController() {
		return TactileStimulusController.Create()
	}
}

export interface ProtocolRunner {
	run(): Promise<void>
}

export type ProtocolRunnerConstructor = new () => ProtocolRunner