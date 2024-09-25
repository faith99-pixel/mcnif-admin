
import { prisma } from "@/lib/prisma";
interface Body{
    name: string;
    description: string;
    price: number;
    isArchived: boolean;
    imageUrl: string;
    }
export async function GET() {
    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: "Hello, Next.js!" }),
    // };
    const testimonial = await prisma.testimonial.findMany()
    return new Response(JSON.stringify(testimonial));
}