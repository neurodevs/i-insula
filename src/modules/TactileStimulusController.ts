export default class TactileStimulusController implements StimulusController {
	public static Class?: StimulusControllerConstructor
	
	protected constructor() {}
	
	public static Create() {
		return new (this.Class ?? this)()
	}
}

export interface StimulusController {}

export type StimulusControllerConstructor = new () => StimulusController