import { prisma } from "@/lib/prisma";

interface Body{
    name: string;
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const updatedEnquiry = await prisma.enquiry.delete({
        where: {
          id: params.id,
        },
      });
  
      return new Response(JSON.stringify({
        message: "Enquiry deleted successfully",
        data: updatedEnquiry
      }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Error deleting the Enquiry",
      }), {
        status: 500,
      });
    }
  }
// export async function DELETE(request:Request,{params}: {params:{id: string}}){
//     // const body: Body = await request.json();
//     const updatedEnquiry = await prisma.Enquiry.delete({
//         where: {
//             id: params.id
//         },
//     })
//     return new Response(JSON.stringify(updatedEnquiry))
// }