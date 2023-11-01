import { BaseInjectedProvider } from './BaseInjected.js'

export class PhantomProvider extends BaseInjectedProvider {
    constructor() {
        super('phantom.solana')
    }

    override async connect(options: unknown): Promise<unknown> {
        await super.connect(options)
        return {
            publicKey: await super.getProperty<string>('publicKey'),
        }
    }
}
