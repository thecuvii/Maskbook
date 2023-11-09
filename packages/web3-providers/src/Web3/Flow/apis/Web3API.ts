import { memoize } from 'lodash-es'
import { type ChainId, type Web3Provider, createClient } from '@masknet/web3-shared-flow'
import { FlowConnectionOptionsAPI } from './ConnectionOptionsAPI.js'
import { FlowWalletProviders } from '../providers/index.js'
import type { FlowConnectionOptions } from '../types/index.js'

const createWeb3SDK = memoize(
    (chainId: ChainId) => createClient(chainId),
    (chainId) => chainId,
)

export class FlowWeb3API {
    constructor(private options?: FlowConnectionOptions) {
        this.ConnectionOptions = new FlowConnectionOptionsAPI(this.options)
    }
    private ConnectionOptions

    getWeb3(initial?: FlowConnectionOptions) {
        const options = this.ConnectionOptions.fill(initial)
        return createWeb3SDK(options.chainId)
    }

    getWeb3Provider(initial?: FlowConnectionOptions): Web3Provider {
        throw new Error('Method not implemented.')
    }

    getProviderInstance(initial?: FlowConnectionOptions) {
        const options = this.ConnectionOptions.fill(initial)
        return FlowWalletProviders[options.providerType]
    }
}
