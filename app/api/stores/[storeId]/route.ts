import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}: {params: {storeId: string}}) {
    try {
         //Check if user is logged in
        const { userId }= auth()
        const body = await req.json()
        
        // Destructure name from store's schema
        const { name } = body

        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

         //Update the store's name
        const store = await prismadb.store.updateMany({
          where: {
            id: params.storeId,
            userId
          },
          data: {
            name
          }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('[STORE_PATCH]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}

// DELETE API

export async function DELETE(req: Request, {params}: {params: {storeId: string}}) {
    try {
         //Check if user is logged in
        const { userId }= auth()
        
        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.storeId) {
            return new NextResponse('Store id is required', { status: 400 })
        }

         //Delete a store
        const store = await prismadb.store.deleteMany({
          where: {
            id: params.storeId,
            userId
          },
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('[STORE_DELETE]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}