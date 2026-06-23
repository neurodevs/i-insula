import {
    BiosensorDeviceFactory,
    CgxDeviceController,
    FakeCgxDeviceController,
    FakeDeviceFactory,
} from '@neurodevs/node-biosensors'
import {
    FakeStreamInlet,
    FakeStreamOutlet,
    FakeStreamInfo,
    LslStreamInfo,
    LslStreamInlet,
    LslStreamOutlet,
} from '@neurodevs/node-lsl'
import {
    WaveshareRoboticArm,
    FakeRoboticArm,
    FakeAxios,
} from '@neurodevs/node-robotic-arm'
import AbstractModuleTest from '@neurodevs/node-tdd'
import {
    AutoWifiConnector,
    FakeWifiConnector,
} from '@neurodevs/node-wifi-connector'
import { FakeXdfRecorder, XdfStreamRecorder } from '@neurodevs/node-xdf'
import type { AxiosStatic } from 'axios'

import AbstractProtocolRunner from '../impl/protocols/AbstractProtocolRunner.js'
import TactileStimulusController from '../impl/TactileStimulusController.js'
import fakeSpeak, { resetFakeSpeak } from '../testDoubles/say/fakeSpeak.js'
import FakeStimulusController from '../testDoubles/StimulusController/FakeStimulusController.js'

export default class AbstractPackageTest extends AbstractModuleTest {
    protected static async beforeEach() {
        await super.beforeEach()

        AbstractProtocolRunner.baselineMs = 0

        this.setFakeAxios()
        this.setFakeCgxDeviceController()
        this.setFakeDeviceFactory()
        this.setFakeStreamInlet()
        this.setFakeStreamOutlet()
        this.setFakeSpeak()
        this.setFakeStreamInfo()
        this.setFakeWifiConnector()
        this.setFakeRoboticArm()
        this.setFakeXdfRecorder()
    }

    protected static setFakeAxios() {
        WaveshareRoboticArm.axios = new FakeAxios() as unknown as AxiosStatic
    }

    protected static setFakeCgxDeviceController() {
        CgxDeviceController.Class = FakeCgxDeviceController
        FakeCgxDeviceController.resetTestDouble()
    }

    protected static setFakeDeviceFactory() {
        BiosensorDeviceFactory.Class = FakeDeviceFactory
        FakeDeviceFactory.resetTestDouble()

        // @ts-ignore
        FakeDeviceFactory.fakeDevice = new FakeCgxDeviceController()
    }

    protected static setFakeSpeak() {
        AbstractProtocolRunner.speak = fakeSpeak
        resetFakeSpeak()
    }

    protected static setFakeStreamInfo() {
        LslStreamInfo.Class = FakeStreamInfo
        FakeStreamInfo.resetTestDouble()
    }

    protected static setFakeStreamInlet() {
        LslStreamInlet.Class = FakeStreamInlet
        FakeStreamInlet.resetTestDouble()
    }

    protected static setFakeStreamOutlet() {
        LslStreamOutlet.Class = FakeStreamOutlet
        FakeStreamOutlet.resetTestDouble()
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

    protected static setFakeXdfRecorder() {
        XdfStreamRecorder.Class = FakeXdfRecorder
        FakeXdfRecorder.resetTestDouble()
    }

    protected static async CgxDeviceController() {
        return CgxDeviceController.Create()
    }

    protected static async TactileStimulusController() {
        return TactileStimulusController.Create()
    }
}
