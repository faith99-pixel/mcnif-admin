
import { prisma } from "@/lib/prisma";
interface Body{
    id: string;
    title: string;
    content: string;
    author: string;
    }
export async function GET() {
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: "Hello, Next.js!" }),
    // };
    const blog = await prisma.blog.findMany()
    return new Response(JSON.stringify(blog));
}