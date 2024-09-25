import { prisma } from "@/lib/prisma";

interface Body{
    name: string;
    description: string;
    price: number;
    isArchived: boolean;
}
export async function PUT(request:Request,{params}: {params:{id: string}}){
    const body: Body = await request.json();
    const updateBuffet = await prisma.buffet.update({
        where: {
            id: params.id,
        },
        data: {
            name: body.name,
            description: body.description,
            price: body.price,
            isArchived: body.isArchived,
        },
    })
    return new Response(JSON.stringify(updateBuffet))
}