import { memo, useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { useFungibleTokenPrice, useNetworkContext, useWeb3State } from '@masknet/web3-hooks-base'
import { InputTokenPanelUI } from './components/InputTokenPanelUI.js'
import type { SelectTokenChipProps } from '@masknet/shared'
import type { Web3Helper } from '@masknet/web3-helpers'
import { isZero, ZERO } from '@masknet/web3-shared-base'

export interface InputTokenPanelProps extends withClasses<'root'> {
    balance: string
    amount: string
    chainId: Web3Helper.ChainIdAll
    maxAmount: string
    token?: Web3Helper.FungibleTokenAll | null
    onAmountChange: (amount: string) => void
    SelectTokenChip?: Partial<SelectTokenChipProps>
}

export const InputTokenPanel = memo<InputTokenPanelProps>(
    ({ chainId, token, balance, onAmountChange, amount, SelectTokenChip: SelectTokenChipProps, maxAmount }) => {
        const { pluginID } = useNetworkContext()
        const { Others } = useWeb3State()
        const { value: tokenPrice = 0 } = useFungibleTokenPrice(pluginID, token?.address.toLowerCase())

        const tokenValueUSD = useMemo(
            () => (amount ? new BigNumber(amount).times(tokenPrice).toFixed(2) : '0'),
            [amount, tokenPrice],
        )

        return (
            <InputTokenPanelUI
                balance={isZero(maxAmount) && Others?.isNativeTokenAddress(token?.address) ? ZERO.toString() : balance}
                token={token}
                amount={amount}
                chainId={chainId}
                maxAmount={maxAmount}
                onAmountChange={onAmountChange}
                tokenValueUSD={tokenValueUSD}
                SelectTokenChip={SelectTokenChipProps}
            />
        )
    },
)
