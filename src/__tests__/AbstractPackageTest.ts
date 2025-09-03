import { WaveshareRoboticArm, FakeRoboticArm, FakeAxios } from "@neurodevs/node-robotic-arm"
import { AutoWifiConnector, FakeWifiConnector } from "@neurodevs/node-wifi-connector"
import AbstractSpruceTest from "@sprucelabs/test-utils"
import type { AxiosStatic } from 'axios'
import TactileStimulusController from "../modules/TactileStimulusController"
import FakeStimulusController from "../testDoubles/FakeStimulusController"
import { BiosensorDeviceFactory, CgxDeviceStreamer, FakeCgxDeviceStreamer, FakeDeviceFactory } from "@neurodevs/node-biosensors"
import { FakeLslOutlet, FakeStreamInfo, LslStreamInfo, LslStreamOutlet } from "@neurodevs/node-lsl"

export default class AbstractPackageTest extends AbstractSpruceTest {
	protected static async beforeEach() {
		await super.beforeEach()

        this.setFakeAxios()
        this.setFakeCgxDeviceStreamer()
        this.setFakeDeviceFactory()
        this.setFakeLslOutlet()
        this.setFakeStreamInfo()
        this.setFakeWifiConnector()
        this.setFakeRoboticArm()
	}

    protected static setFakeAxios() {
        WaveshareRoboticArm.axios = new FakeAxios() as unknown as AxiosStatic
    }

    protected static setFakeCgxDeviceStreamer() {
        CgxDeviceStreamer.Class = FakeCgxDeviceStreamer
        FakeCgxDeviceStreamer.resetTestDouble()
    }

    protected static setFakeDeviceFactory() {
        BiosensorDeviceFactory.Class = FakeDeviceFactory
        FakeDeviceFactory.resetTestDouble()

        FakeDeviceFactory.fakeDevice = new FakeCgxDeviceStreamer()
    }

    protected static setFakeStreamInfo() {
        LslStreamInfo.Class = FakeStreamInfo
        FakeStreamInfo.resetTestDouble()
    }

    protected static setFakeLslOutlet() {
        LslStreamOutlet.Class = FakeLslOutlet
        FakeLslOutlet.resetTestDouble()
    }

    protected static setFakeRoboticArm() {
        WaveshareRoboticArm.Class = FakeRoboticArm
        FakeRoboticArm.resetTestDouble()
    }

    protected static setFakeStimulusController() {
        TactileStimulusController.Class = FakeStimulusController
        FakeStimulusController.resetTestDouble()
    }

    protected static setFakeWifiConnector() {
        AutoWifiConnector.Class = FakeWifiConnector
        FakeWifiConnector.resetTestDouble()
    }
}