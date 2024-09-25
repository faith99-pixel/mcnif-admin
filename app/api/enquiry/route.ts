import { prisma } from "@/lib/prisma";

export async function GET() {
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: "Hello, Next.js!" }),
    // };
    const enquiries = await prisma.enquiry.findMany()
    return new Response(JSON.stringify(enquiries));
}
