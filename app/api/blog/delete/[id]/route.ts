import { prisma } from "@/lib/prisma";

interface Body{
    name: string;
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const updatedBlog = await prisma.blog.delete({
        where: {
          id: params.id,
        },
      });
  
      return new Response(JSON.stringify({
        message: "blog deleted successfully",
        data: updatedBlog
      }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Error deleting the blog",
      }), {
        status: 500,
      });
    }
  }
// export async function DELETE(request:Request,{params}: {params:{id: string}}){
//     // const body: Body = await request.json();
//     const updatedBlog = await prisma.blog.delete({
//         where: {
//             id: params.id
//         },
//     })
//     return new Response(JSON.stringify(updatedBlog))
// }