import { BigNumber } from '@ethersproject/bignumber'

export interface FundingCycle {
  id: BigNumber
  projectId: BigNumber
  number: BigNumber
  previous: BigNumber
  target: BigNumber
  currency: BigNumber // 0 ETH, 1 USD
  start: BigNumber
  duration: BigNumber
  tappedTarget: BigNumber
  tappedTotal: BigNumber
  reserved: BigNumber
  fee: BigNumber
  weight: BigNumber
  discountRate: BigNumber
  bondingCurveRate: BigNumber
  configured: BigNumber
  ballot: string
}