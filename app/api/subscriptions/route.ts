// import { prisma } from "@/lib/prisma";

import { prisma } from "@/lib/prisma";

export async function GET() {
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: "Hello, Next.js!" }),
    // };
    const subscriptions = await prisma.subscription.findMany()
    return new Response(JSON.stringify(subscriptions));
}
