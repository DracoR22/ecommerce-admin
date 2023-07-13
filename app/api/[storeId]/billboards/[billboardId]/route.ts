import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//GET BILLBOARDS
export async function GET(req: Request, {params}: {params: {billboardId: string}}) {
    try {
  
        if(!params.billboardId) {
            return new NextResponse('Billboard id is required', { status: 400 })
        }

         //Display a billboard
        const billboard = await prismadb.billboard.findUnique({
          where: {
            id: params.billboardId,
          },
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARD_GET]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}

//EDIT BILLBOARD
export async function PATCH(req: Request, {params}: {params: {storeId: string, billboardId: string}}) {
    try {
         //Check if user is logged in
        const { userId } = auth()
        const body = await req.json()
        
        // Destructure name 
        const { label, imageUrl } = body

        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 })
        }
        
        if (!label) {
            return new NextResponse('Label is required', { status: 400 })
        }

        if(!params.billboardId) {
            return new NextResponse('Billboard id is required', { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 405 })
        }

         //Update the billboard
        const billboard = await prismadb.billboard.updateMany({
          where: {
            id: params.billboardId,
          },
          data: {
            label,
            imageUrl
          }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}

// DELETE BILLBOARD

export async function DELETE(req: Request, {params}: {params: {storeId: string, billboardId: string}}) {
    try {
         //Check if user is logged in
        const { userId }= auth()
        
        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.billboardId) {
            return new NextResponse('Billboard id is required', { status: 400 })
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

         //Delete a billboard
        const billboard = await prismadb.billboard.deleteMany({
          where: {
            id: params.billboardId,
          },
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}