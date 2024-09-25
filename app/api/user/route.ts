import { prisma } from "@/lib/prisma";

export async function GET() {
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: "Hello, Next.js!" }),
    // };
    // const user = await prisma.user.findMany({
    //     where: {
    //         userId: {
    //             startsWith: "Z",
    //         }
    //     },
    // })
    const user = await prisma.user.findMany()
    return new Response(JSON.stringify(user));
}