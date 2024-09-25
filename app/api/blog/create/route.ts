import { prisma } from "@/lib/prisma";

interface Body {
    id: string;
    title: string;
    content: string;
    author: string;
}

export async function POST(request: Request) {
    try {
        const body: Body = await request.json();
        
        // Create a blog using the correct model and fields
        const blog = await prisma.blog.create({
            data: {
                title: body. title,
                content: body.content,
                author: body.author,
            },
        });

        return new Response(JSON.stringify(blog), { status: 201 });

    } catch (error) {
        console.error("Error creating blog:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

