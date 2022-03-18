import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export function useDistributionLimitCurrency({
  projectId,
}: {
  projectId?: BigNumber
}) {
  return useV2ContractReader<BigNumber>({
    contract: V2ContractName.JBController,
    functionName: 'distributionLimitCurrencyOf',
    args: projectId ? [projectId] : null,
  })
}
