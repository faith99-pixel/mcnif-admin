// import { prisma } from "@/lib/prisma";

// interface Body {
//     name: string;
//     content: string;
//     rating: number;
//     imageUrl: String;
// }
// export async function GET(request: Request) {
//     // const testimonial = await prisma.testimonial.create({
//     //     data: {
//     //         name: "Chicken buffet",
//     //         content: "The best platter you'd ever find",
//     //     }
//     // })

//     // const testimonial = await prisma.testimonial.createMany({
//     //     data: [
//     //         {
//     //             name: "Julius",
//     //             content: "Go treat yourself a buffet",
//     //             rating: 4,
//     //             imageUrl: ""
//     //         },
//     //         // {
//     //         //     name: "Mandy",
//     //         //     description: "Go buy a buffet",
//     //         //     price: "9000",
//     //         // }
//     //     ]
//     // })
//     const body:Body = await request.json();
//     const testimonial = await prisma.testimonial.create({
//         data: {
//             name: body.name,
//             content: body.content,
//             rating: body.rating,
//             imageUrl: body.imageUrl as string,
//         },
//     })
//     return new Response(JSON.stringify(testimonial)
//     )
// }

import { prisma } from "@/lib/prisma";

interface Body {
    name: string;
    content: string;
    rating: number;
    imageUrl: string;
}

export async function POST(request: Request) {
    try {
        const body: Body = await request.json();
        
        // Create a testimonial using the correct model and fields
        const testimonial = await prisma.testimonial.create({
            data: {
                name: body.name,
                content: body.content,
                rating: body.rating,
                imageUrl: body.imageUrl,
            },
        });

        return new Response(JSON.stringify(testimonial), { status: 201 });

    } catch (error) {
        console.error("Error creating testimonial:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}


