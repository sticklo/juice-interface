import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import ETHAmount from 'components/shared/ETHAmount'
import StatLine from 'components/shared/Project/StatLine'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { CSSProperties, useContext } from 'react'
import { formatWad, fromWad } from 'utils/formatNumber'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'utils/v2/currency'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useDistributionLimitCurrency } from 'hooks/v2/contractReader/DistributionLimitCurrency'

export default function TreasuryStats() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    projectId,
    ETHBalance,
    balanceInDistributionLimitCurrency,
    distributionLimitCurrency,
  } = useContext(V2ProjectContext)
  const converter = useCurrencyConverter()

  const spacing = 10

  const primaryTextStyle: CSSProperties = {
    fontWeight: 500,
    fontSize: '1.1rem',
    lineHeight: 1,
  }
  const secondaryTextStyle: CSSProperties = {
    textTransform: 'uppercase',
    color: colors.text.tertiary,
    fontSize: '0.8rem',
    fontWeight: 500,
  }

  const formatCurrencyAmount = (amt: BigNumber | undefined) => {
    if (!amt) return null

    return distributionLimitCurrency?.eq(V2_CURRENCY_USD) ? (
      <span>
        <Tooltip
          title={
            <span>
              {/* <CurrencySymbol currency={V2_CURRENCY_ETH} /> */}
              {formatWad(converter.usdToWei(fromWad(amt)), {
                precision: 2,
                padEnd: true,
              })}
            </span>
          }
        >
          {/* <CurrencySymbol currency={V2_CURRENCY_USD} /> */}
          {formatWad(amt, { precision: 2, padEnd: true })}
        </Tooltip>
      </span>
    ) : (
      <span>
        {/* <CurrencySymbol currency={V2_CURRENCY_ETH} /> */}
        {formatWad(amt, { precision: 2, padEnd: true })}
      </span>
    )
  }

  return (
    <StatLine
      statLabel={<Trans>In Juicebox</Trans>}
      statLabelTip={
        <Trans>The balance of this project in the Juicebox contract.</Trans>
      }
      statValue={
        <div
          style={{
            ...primaryTextStyle,
            color: colors.text.brand.primary,
            marginLeft: 10,
          }}
        >
          {distributionLimitCurrency?.eq(V2_CURRENCY_USD) ? (
            <span style={secondaryTextStyle}>
              <ETHAmount amount={ETHBalance} precision={2} padEnd={true} />{' '}
            </span>
          ) : (
            ''
          )}
          {formatCurrencyAmount(balanceInDistributionLimitCurrency)}
        </div>
      }
      style={{ marginBottom: spacing }}
    />
  )
}
