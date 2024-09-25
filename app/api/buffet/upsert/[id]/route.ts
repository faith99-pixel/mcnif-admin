import { prisma } from "@/lib/prisma";

interface Body{
    name: string;
}
export async function PUT(request:Request,{params}: {params:{id: string}}){
    const body: Body = await request.json();
    const updatedBuffet = await prisma.buffet.upsert({
        where: {
            id: params.id,
        },
        update: {
            name: "buffetFound",
           
        },
        create: {
            name: "Chicken pepperoni",
            price: 7500
        }
    })
    return new Response(JSON.stringify(updatedBuffet))
}