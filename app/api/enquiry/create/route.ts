import { prisma } from "@/lib/prisma";

interface Body {
    id: string;
    name: string;
    email: string;
    message: string;
    status: string;
}

export async function POST(request: Request) {
    try {
        const body: Body = await request.json();
        
        // Create a enquiry using the correct model and fields
        const Enquiry = await prisma.enquiry.create({
            data: {
                name: body. name,
                email: body.email,
                message: body.message,
                status: body.status,
            },
        });

        return new Response(JSON.stringify(Enquiry), { status: 201 });

    } catch (error) {
        console.error("Error creating enquiry:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

