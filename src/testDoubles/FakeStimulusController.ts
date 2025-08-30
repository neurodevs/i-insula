import { RoboticArm } from "@neurodevs/node-robotic-arm"
import { StimulusController } from "../modules/TactileStimulusController"

export default class FakeStimulusController implements StimulusController {
    public static callsToConstructor: RoboticArm[] = []
    public static callsToStimulateForearm: ('left' | 'right')[] = []
    public static numCallsToDisconnect: number = 0

    public constructor(arm: RoboticArm) {
        FakeStimulusController.callsToConstructor.push(arm)
    }
    
    public async stimulateForearm(side: 'left' | 'right'){
        FakeStimulusController.callsToStimulateForearm.push(side)
    }

    public async disconnect() {
        FakeStimulusController.numCallsToDisconnect++
    }

    public static resetTestDouble() {
        this.callsToConstructor = []
        this.callsToStimulateForearm = []
        this.numCallsToDisconnect = 0
    }
}