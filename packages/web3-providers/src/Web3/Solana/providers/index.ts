import { ProviderType, type ChainId, type Transaction } from '@masknet/web3-shared-solana'
import { SolanaPhantomProvider } from './Phantom.js'
import { NoneProvider } from './None.js'
import { SolanaSolflareProvider } from './SolflareProvider.js'
import { SolanaSolletProvider } from './Sollet.js'
import { SolanaCoin98Provider } from './Coin98.js'
import type { WalletAPI } from '../../../entry-types.js'

export interface SolanaWalletProvider extends WalletAPI.Provider<ChainId, ProviderType> {
    /** Sign message */
    signMessage(message: string): Promise<string>
    /** Verify signature */
    /** Sign a transaction */
    signTransaction(transaction: Transaction): Promise<Transaction>
    /** Sign multiple transactions */
    signTransactions(transactions: Transaction[]): Promise<Transaction[]>
}

export const SolanaWalletProviders: Record<ProviderType, SolanaWalletProvider> = {
    [ProviderType.None]: new NoneProvider(),
    [ProviderType.Phantom]: new SolanaPhantomProvider(),
    [ProviderType.Solflare]: new SolanaSolflareProvider(),
    [ProviderType.Sollet]: new SolanaSolletProvider(),
    [ProviderType.Coin98]: new SolanaCoin98Provider(),
}
