import { WaveshareRoboticArm, FakeRoboticArm, FakeAxios } from "@neurodevs/node-robotic-arm"
import { AutoWifiConnector, FakeWifiConnector } from "@neurodevs/node-wifi-connector"
import AbstractSpruceTest from "@sprucelabs/test-utils"
import type { AxiosStatic } from 'axios'
import TactileStimulusController from "../modules/TactileStimulusController"
import FakeStimulusController from "../testDoubles/FakeStimulusController"

export default class AbstractPackageTest extends AbstractSpruceTest {
	protected static async beforeEach() {
		await super.beforeEach()

        this.setFakeRoboticArm()
        this.setFakeWifiConnector()
        this.setFakeAxios()
	}

    protected static setFakeRoboticArm() {
        WaveshareRoboticArm.Class = FakeRoboticArm
        FakeRoboticArm.resetTestDouble()
    }

    protected static setFakeWifiConnector() {
        AutoWifiConnector.Class = FakeWifiConnector
        FakeWifiConnector.resetTestDouble()
    }  

    protected static setFakeAxios() {
        WaveshareRoboticArm.axios = new FakeAxios() as unknown as AxiosStatic
    }

    protected static setFakeStimulusController() {
        TactileStimulusController.Class = FakeStimulusController
        FakeStimulusController.resetTestDouble()
    }
}