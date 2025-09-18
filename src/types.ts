import { ProtocolRunnerConstructorOptions } from "./modules/protocols/AbstractProtocolRunner"

export interface ProtocolRunner {
    run(): Promise<void>
}

export type ProtocolRunnerConstructor = new (options: ProtocolRunnerConstructorOptions) => ProtocolRunner