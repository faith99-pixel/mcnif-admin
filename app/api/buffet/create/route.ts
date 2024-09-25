import { prisma } from "@/lib/prisma";

interface Body{
name: string;
description: string;
price: number;
isArchived: boolean;
imageUrl: string;
}
export async function POST(request: Request) {
    // const buffet = await prisma.buffet.create({
    //     data: {
    //         name: "Chicken buffet",
    //         description: "The best platter you'd ever find",
    //         price: "6000",
    //         isArchived: false,
    //         foods:{
    //             create: [
    //                 {
    //                     name: "Chicken",
    //                     price: "500",
    //                     description: "Sweet food"
    //                 }
    //             ]
    //         }
    //     }
    // })

    // const buffet = await prisma.buffet.createMany({
    //     data: [
    //         {
    //             name: "Julius",
    //             description: "Go treat yourself a buffet",
    //             price: "7000",
    //         },
    //         {
    //             name: "Mandy",
    //             description: "Go buy a buffet",
    //             price: "9000",
    //         }
    //     ]
    // })
    const body:Body = await request.json();
    const buffet = await prisma.buffet.create({
        data: body
    })
    return new Response(JSON.stringify(buffet)
)
}

