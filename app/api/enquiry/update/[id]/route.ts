import { prisma } from "@/lib/prisma";

interface Body{
    id: string;
    name: string;
    email: string;
    message: string;
    status: string;
}
export async function PUT(request:Request,{params}: {params:{id: string}}){
    const body: Body = await request.json();
    const updateEnquiry = await prisma.enquiry.update({
        where: {
            id: params.id,
        },
        data: {
            name: body.name,
            email: body.email,
            message: body.message,
            status: body.status,
        },
    })
    return new Response(JSON.stringify(updateEnquiry))
}