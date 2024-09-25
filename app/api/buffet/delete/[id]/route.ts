import { prisma } from "@/lib/prisma";

interface Body{
    name: string;
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const updatedBuffet = await prisma.buffet.delete({
        where: {
          id: params.id,
        },
      });
  
      return new Response(JSON.stringify({
        message: "Buffet deleted successfully",
        data: updatedBuffet
      }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Error deleting the buffet",
      }), {
        status: 500,
      });
    }
  }
// export async function DELETE(request:Request,{params}: {params:{id: string}}){
//     // const body: Body = await request.json();
//     const updatedBuffet = await prisma.buffet.delete({
//         where: {
//             id: params.id
//         },
//     })
//     return new Response(JSON.stringify(updatedBuffet))
// }