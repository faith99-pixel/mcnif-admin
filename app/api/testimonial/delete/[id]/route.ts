import { prisma } from "@/lib/prisma";

interface Body{
    name: string;
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const updatedTestimonial = await prisma.testimonial.delete({
        where: {
          id: params.id,
        },
      });
  
      return new Response(JSON.stringify({
        message: "Testimonial deleted successfully",
        data: updatedTestimonial
      }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Error deleting the Testimonial",
      }), {
        status: 500,
      });
    }
  }
// export async function DELETE(request:Request,{params}: {params:{id: string}}){
//     // const body: Body = await request.json();
//     const updatedTestimonial = await prisma.Testimonial.delete({
//         where: {
//             id: params.id
//         },
//     })
//     return new Response(JSON.stringify(updatedTestimonial))
// }