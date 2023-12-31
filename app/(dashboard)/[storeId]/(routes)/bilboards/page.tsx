import { format } from 'date-fns'
import React from 'react'
import BillboardClient from './components/BillboardClient'
import prismadb from '@/lib/prismadb'
import { BillboardCollumn } from './components/Columns'

const BilboardsPage = async ({params}: {params: {storeId: string}}) => {

const billboards = await prismadb.billboard.findMany({
  where: {
    storeId: params.storeId
  },
  orderBy: {
    createdAt: 'desc'
  }
})

const formattedBillboards: BillboardCollumn[] = billboards.map((item) => ({
  id: item.id,
  label: item.label,
  createdAt: format(item.createdAt, 'MMMM do, yyyy')
}))

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
           <BillboardClient data={formattedBillboards}/>
        </div>
    </div>
  )
}

export default BilboardsPage