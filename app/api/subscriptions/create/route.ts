import { prisma } from "@/lib/prisma";

interface Body {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function POST(request: Request) {
    try {
        const body: Body = await request.json();
        
        // Create a subscription using the correct model and fields
        const subscriptions = await prisma.subscription.create({
            data: {
                email: body. email,
            },
        });

        return new Response(JSON.stringify(subscriptions), { status: 201 });
        
    } catch (error) {
        console.error("Error creating subscription:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

