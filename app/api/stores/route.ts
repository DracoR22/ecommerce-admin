import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST (req: Request) {
    try {
        //Check if user is logged in
        const { userId } = auth()
        const body = await req.json()
        
        // Destructure name from store's schema
        const { name } = body
        
        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        //Create the new store
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('[STORES_POST]', error)
        return new NextResponse('Internal error', { status: 500})
    }
}