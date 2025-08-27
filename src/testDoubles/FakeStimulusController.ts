import { RoboticArm } from "@neurodevs/node-robotic-arm"
import { StimulusController } from "../modules/TactileStimulusController"

export default class FakeStimulusController implements StimulusController {
    public static callsToConstructor: RoboticArm[] = []
    public static callsToStimulateForearm: ('left' | 'right')[] = []

    public constructor(arm: RoboticArm) {
        FakeStimulusController.callsToConstructor.push(arm)
    }
    
    public async stimulateForearm(side: 'left' | 'right'){
        FakeStimulusController.callsToStimulateForearm.push(side)
    }
    
    public static resetTestDouble() {
        this.callsToConstructor = []
        this.callsToStimulateForearm = []
    }
}