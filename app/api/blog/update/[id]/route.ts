import { prisma } from "@/lib/prisma";

interface Body{
    id: string;
    title: string;
    content: string;
    author: string;
}
export async function PUT(request:Request,{params}: {params:{id: string}}){
    const body: Body = await request.json();
    const updateBlog = await prisma.blog.update({
        where: {
            id: params.id,
        },
        data: {
            title: body.title,
            content: body.content,
            author: body.author,
        },
    })
    return new Response(JSON.stringify(updateBlog))
}