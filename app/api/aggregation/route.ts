import { prisma } from "@/lib/prisma";

export async function GET() {
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: "Hello, Next.js!" }),
    // };
    const aggregation = await prisma.buffet.aggregate({
        _sum:{
            
        }
    })
      
    return new Response(JSON.stringify(aggregation));
}