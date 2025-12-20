import { DeviceStreamer } from "@neurodevs/node-biosensors"
import { LslStreamInlet } from "@neurodevs/node-lsl"

export default class ProtocolAnalyticsRunner implements AnalyticsRunner {
	public static Class?: AnalyticsRunnerConstructor
	
	protected constructor() {}
	
	public static Create(options: AnalyticsRunnerOptions) {
		const { devices } = options

		this.createLslInlets(devices)

		return new (this.Class ?? this)()
	}

	private static createLslInlets(devices: DeviceStreamer[]) {
		devices.map((device: DeviceStreamer) => {
			return device.outlets.map((outlet) => {
				const options = {
					'info': outlet.info,
					'sampleRate': outlet.sampleRateHz,
					'channelNames': outlet.channelNames,
					'channelFormat': outlet.channelFormat,
					'chunkSize': outlet.chunkSize,
					'maxBuffered': outlet.maxBufferedMs,
					'name': outlet.name,
					'type': outlet.type,
					'sourceId': outlet.sourceId,
					'manufacturer': outlet.manufacturer,
					'units': outlet.units,
				}
				return LslStreamInlet.Create(options, () => {})
			})
		})
	}
}

export interface AnalyticsRunner {}

export type AnalyticsRunnerConstructor = new () => AnalyticsRunner

export interface AnalyticsRunnerOptions {
	devices: DeviceStreamer[]
}
