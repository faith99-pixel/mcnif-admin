import { prisma } from "@/lib/prisma";

interface Body{
    id: string;
    name: string;
    content: string;
    rating: number;
    imageUrl: string;
}
export async function PUT(request:Request,{params}: {params:{id: string}}){
    const body: Body = await request.json();
    const updateTestimonial = await prisma.testimonial.update({
        where: {
            id: params.id,
        },
        data: {
            name: body.name,
            content: body.content,
            rating: body.rating,
            imageUrl: body.imageUrl,
        },
    })
    return new Response(JSON.stringify(updateTestimonial))
}