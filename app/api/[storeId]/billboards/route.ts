import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// POST BILLBOARDS
export async function POST (req: Request, { params }: {params: {storeId: string}}) {
    try {
        //Check if user is logged in
        const { userId } = auth()
        const body = await req.json()
        
        // Destructure label and imageUrl from billboard's schema
        const { label, imageUrl } = body
        
        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthenticated', { status: 401 })
        }

        if(!label) {
            return new NextResponse('Label is required', { status: 400 })
        }

        if(!imageUrl) {
            return new NextResponse('imageUrl is required', { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 })
        }

        //Create the new billboard
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARDS_POST]', error)
        return new NextResponse('Internal error', { status: 500})
    }
}


//DISPLAY BILLBOARDS
export async function GET (req: Request, { params }: {params: {storeId: string}}) {
    try {
        if(!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 })
        }
        
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboards)

    } catch (error) {
        console.log('[BILLBOARDS_GET]', error)
        return new NextResponse('Internal error', { status: 500})
    }
}