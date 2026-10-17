import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
}

const ItemsTemplate = ({ items }: ItemsTemplateProps) => {
  const sortedItems = items
    ? [...items].sort((a, b) =>
        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
      )
    : undefined

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Sepetiniz</Heading>
      </div>
      <div className="small:hidden">
        {sortedItems
          ? sortedItems.map((item) => (
              <Item key={`mobile-${item.id}`} item={item} type="mobile" />
            ))
          : repeat(3).map((i) => (
              <div
                key={`mobile-${i}`}
                className="mb-3 h-36 animate-pulse rounded-lg border border-ui-border-base bg-ui-bg-subtle"
              />
            ))}
      </div>

      <Table className="hidden small:table">
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Ürün</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Adet</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Fiyat
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Toplam
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedItems
            ? sortedItems.map((item) => {
                return <Item key={item.id} item={item} />
              })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
