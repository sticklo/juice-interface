import { t } from '@lingui/macro'
import Loading from 'components/shared/Loading'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { PayEvent } from 'models/subgraph-entities/pay-event'
import { PrintReservesEvent } from 'models/subgraph-entities/print-reserves-event'
import { ProjectCreateEvent } from 'models/subgraph-entities/project-create-event'
import { RedeemEvent } from 'models/subgraph-entities/redeem-event'
import { TapEvent } from 'models/subgraph-entities/tap-event'
import { useContext } from 'react'

import SectionHeader from '../SectionHeader'
import ActivityTabContent from './ActivityTabContent'
import PayEventElem from './items/PayEventElem'
import ProjectCreateEventElem from './items/ProjectCreateEventElem'
import RedeemEventElem from './items/RedeemEventElem'
import ReservesEventElem from './items/ReservesEventElem'
import TapEventElem from './items/TapEventElem'

export default function ProjectActivity() {
  const { projectId } = useContext(V1ProjectContext)

  const pageSize = 50

  const {
    data: projectEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteSubgraphQuery({
    pageSize,
    entity: 'projectEvent',
    keys: [
      'id',
      {
        entity: 'payEvent',
        keys: ['amount', 'timestamp', 'beneficiary', 'note', 'id', 'txHash'],
      },
      {
        entity: 'tapEvent',
        keys: [
          'id',
          'timestamp',
          'txHash',
          'caller',
          'beneficiary',
          'beneficiaryTransferAmount',
          'netTransferAmount',
        ],
      },
      {
        entity: 'printReservesEvent',
        keys: [
          'id',
          'timestamp',
          'txHash',
          'caller',
          'beneficiary',
          'beneficiaryTicketAmount',
          'count',
        ],
      },
      {
        entity: 'redeemEvent',
        keys: [
          'id',
          'amount',
          'beneficiary',
          'txHash',
          'timestamp',
          'returnAmount',
        ],
      },
      {
        entity: 'projectCreateEvent',
        keys: ['id', 'txHash', 'timestamp', 'caller'],
      },
    ],
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where: projectId
      ? [
          {
            key: 'projectId',
            value: projectId.toNumber(),
          },
          {
            key: 'cv',
            value: 1,
          },
        ]
      : undefined,
  })

  return (
    <div>
      <SectionHeader text={t`Activity`} />

      <ActivityTabContent
        count={
          projectEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0
        }
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isLoadingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      >
        {projectEvents?.pages.map(group =>
          group.map(e => {
            if (e.payEvent)
              return <PayEventElem event={e.payEvent as PayEvent} />
            if (e.tapEvent)
              return <TapEventElem event={e.tapEvent as TapEvent} />
            if (e.redeemEvent)
              return <RedeemEventElem event={e.redeemEvent as RedeemEvent} />
            if (e.printReservesEvent)
              return (
                <ReservesEventElem
                  event={e.printReservesEvent as PrintReservesEvent}
                />
              )
            if (e.projectCreateEvent)
              return (
                <ProjectCreateEventElem
                  event={e.projectCreateEvent as ProjectCreateEvent}
                />
              )
          }),
        )}
      </ActivityTabContent>

      {isLoading || (isFetchingNextPage && <Loading />)}
    </div>
  )
}
