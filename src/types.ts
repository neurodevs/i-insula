import { ProtocolRunnerConstructorOptions } from "./modules/AbstractProtocolRunner"

export interface ProtocolRunner {
    run(): Promise<void>
}

export type ProtocolRunnerConstructor = new (options: ProtocolRunnerConstructorOptions) => ProtocolRunner