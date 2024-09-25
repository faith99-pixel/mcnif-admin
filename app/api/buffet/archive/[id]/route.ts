import { prisma } from "@/lib/prisma";

interface Body{
    name: string;
}
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    // const body: Body = await request.json();
    // const archiveBuffet = await prisma.buffet.archive({
    //     where: {
    //         id: params.id,
    //     },
    //     data: {
    //         name: body.name
    //     },
    // })
    // return new Response(JSON.stringify(archiveBuffet))
//     try {
//       const updatedBuffet = await prisma.buffet.delete({
//         where: {
//           id: params.id,
//         },
//       });
  
//       return new Response(JSON.stringify({
//         message: "Buffet archived successfully",
//         data: updatedBuffet
//       }), {
//         status: 200,
//       });
//     } catch (error) {
//       return new Response(JSON.stringify({
//         error: "Error archiving the buffet",
//       }), {
//         status: 500,
//       });
//     }
//   }
// export async function DELETE(request:Request,{params}: {params:{id: string}}){
//     // const body: Body = await request.json();
//     const updatedBuffet = await prisma.buffet.delete({
//         where: {
//             id: params.id
//         },
//     })
//     return new Response(JSON.stringify(updatedBuffet))
// }
}