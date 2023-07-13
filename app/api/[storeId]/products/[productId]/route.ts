import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

//GET PRODUCT
export async function GET(req: Request, {params}: {params: {productId: string}}) {
    try {
  
        if(!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
        }

         //Display a product
        const product = await prismadb.product.findUnique({
          where: {
            id: params.productId,
          },
          include: {
            images: true,
            category: true,
            size: true,
            color: true
          }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}

//EDIT PRODUCT
export async function PATCH(req: Request, {params}: {params: {storeId: string, productId: string}}) {
    try {
         //Check if user is logged in
        const { userId } = auth()
        const body = await req.json()
        
        // Destructure Proctuct's Properties
        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body

        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

       
        if(!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if(!price) {
            return new NextResponse('Price is required', { status: 400 })
        }

        if(!categoryId) {
            return new NextResponse('CategoryId is required', { status: 400 })
        }

        if(!sizeId) {
            return new NextResponse('SizeId is required', { status: 400 })
        }

        if(!colorId) {
            return new NextResponse('ColorId is required', { status: 400 })
        }

        if(!images || !images.length) {
            return new NextResponse('Images are required', { status: 400 })
        }

        if(!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
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

         //Update the Product
        await prismadb.product.update({
          where: {
            id: params.productId,
          },
          data: {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images: {
                deleteMany: {}
            },
            isFeatured,
            isArchived
          }
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}


// DELETE PRODUCT
export async function DELETE(req: Request, {params}: {params: {storeId: string, productId: string}}) {
    try {
         //Check if user is logged in
        const { userId }= auth()
        
        //Check for any errors
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if(!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
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
        const product = await prismadb.product.deleteMany({
          where: {
            id: params.productId,
          },
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}