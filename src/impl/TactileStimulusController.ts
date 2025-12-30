import { RoboticArm, WaveshareRoboticArm } from '@neurodevs/node-robotic-arm'

export default class TactileStimulusController implements StimulusController {
    public static Class?: StimulusControllerConstructor

    private arm: RoboticArm

    protected constructor(arm: RoboticArm) {
        this.arm = arm
    }

    public static async Create() {
        const arm = await this.WaveshareRoboticArm()
        return new (this.Class ?? this)(arm)
    }

    public async stimulateForearm(side: 'left' | 'right') {
        if (side == 'left') {
            await this.stimulateLeftForearm()
        } else {
            await this.stimulateRightForearm()
        }
        await this.arm.resetToOrigin()
    }

    private async stimulateLeftForearm() {
        await this.moveTo({ x: 200, y: -300, z: -50, spd: 0.3 })
        await this.moveTo({ x: 200, y: -300, z: -110, spd: 0.1 })
        await this.moveTo({ x: 250, y: -280, z: -110, spd: 0.1 })
        await this.moveTo({ x: 250, y: -280, z: -50, spd: 0.1 })
        await this.moveTo({ x: 200, y: -300, z: -50, spd: 0.1 })
    }

    private async stimulateRightForearm() {
        await this.moveTo({ x: 200, y: 300, z: -50, spd: 0.3 })
        await this.moveTo({ x: 200, y: 300, z: -110, spd: 0.1 })
        await this.moveTo({ x: 250, y: 280, z: -110, spd: 0.1 })
        await this.moveTo({ x: 250, y: 280, z: -50, spd: 0.1 })
        await this.moveTo({ x: 200, y: 300, z: -50, spd: 0.1 })
    }

    private get moveTo() {
        return this.arm.moveTo
    }

    public async disconnect() {
        await this.arm.disconnect()
    }

    private static WaveshareRoboticArm() {
        return WaveshareRoboticArm.Create({
            origin: { x: 200, y: 0, z: -50, spd: 0.3 },
        })
    }
}

export interface StimulusController {
    stimulateForearm(side: 'left' | 'right'): Promise<void>
    disconnect(): Promise<void>
}

export type StimulusControllerConstructor = new (
    arm: RoboticArm
) => StimulusController
