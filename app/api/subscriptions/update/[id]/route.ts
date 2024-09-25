import { prisma } from "@/lib/prisma";

interface Body{
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export async function PUT(request:Request,{params}: {params:{id: string}}){
    const body: Body = await request.json();
    const updateSubscription = await prisma.subscription.update({
        where: {
            id: params.id,
        },
        data: {
            email: body.email,
        },
    })
    return new Response(JSON.stringify(updateSubscription))
}