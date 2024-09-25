import { prisma } from "@/lib/prisma";

interface Body{
    name: string;
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const updatedSubscriptions = await prisma.subscription.delete({
        where: {
          id: params.id,
        },
      });
  
      return new Response(JSON.stringify({
        message: "subscription deleted successfully",
        data: updatedSubscriptions
      }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Error deleting the subscription",
      }), {
        status: 500,
      });
    }
  }
// export async function DELETE(request:Request,{params}: {params:{id: string}}){
//     // const body: Body = await request.json();
//     const updatedsubscriptions = await prisma.subscriptions.delete({
//         where: {
//             id: params.id
//         },
//     })
//     return new Response(JSON.stringify(updatedsubscriptions))
// }