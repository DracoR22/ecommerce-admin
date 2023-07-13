import prismadb from '@/lib/prismadb'
import React from 'react'
import { BilboardForm } from './components/BilboardForm'

const BilboardPage = async ({params}: {params: {bilboardId: string}}) => {

const billboard = await prismadb.billboard.findUnique({
    where: {
        id: params.bilboardId
    }
})

  return (
   <div className='flex-col'>
     <div className='flex-1 space-y-4 p-8 pt-6'>
       <BilboardForm initialData={billboard}/>
     </div>
   </div>
  )
}

export default BilboardPage