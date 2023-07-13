'use client'

import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { OrderCollumn, columns } from './Columns'
import { DataTable } from '@/components/ui/data-table'


interface OrderClientProps {
  data: OrderCollumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({data}) => {

  return (
    <>
    <Heading title={`Orders (${data.length})`} description='Manage orders for your store'/>
    <Separator/>
    <DataTable searchKey='products' columns={columns} data={data}/>
    </>
  )
}

export default OrderClient