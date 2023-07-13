import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(req: Request, {params}: {params: {categoryId: string}}) {
    try {
  
        if(!params.categoryId) {
            return new NextResponse('Category ID is required', { status: 400 })
        }

        //display category
        const category = await prismadb.category.findUnique({
          where: {
            id: params.categoryId,
          },
          include: {
            billboard: true
          }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}


export async function PATCH(req: Request, {params}: {params: {storeId: string, categoryId: string}}) {
    try {
         //Check if user is logged in
        const { userId } = auth()
        const body = await req.json()
        
        // Destructure name 
        const { name, billboardId } = body

        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 })
        }
        
        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if(!params.categoryId) {
            return new NextResponse('Category ID is required', { status: 400 })
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

         //Update the category
        const category = await prismadb.category.updateMany({
          where: {
            id: params.categoryId,
          },
          data: {
            name,
            billboardId
          }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}

// DELETE BILLBOARD

export async function DELETE(req: Request, {params}: {params: {storeId: string, categoryId: string}}) {
    try {
         //Check if user is logged in
        const { userId }= auth()
        
        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.categoryId) {
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
        const category = await prismadb.category.deleteMany({
          where: {
            id: params.categoryId,
          },
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}