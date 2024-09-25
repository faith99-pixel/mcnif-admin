// import { prisma } from "@/lib/prisma";

import { prisma } from "@/lib/prisma";

// export async function GET() {
//     // return {
//     //     statusCode: 200,
//     //     body: JSON.stringify({ message: "Hello, Next.js!" }),
//     // };
//     const buffets = await prisma.buffet.findMany()
//     return new Response(JSON.stringify(buffets));
// }


export async function GET() {
  try {
    const buffets = await prisma.buffet.findMany({
      where: {
        isArchived: false, // Fetch only non-archived buffets
      },
      include: {
        foods: true,         // Include associated foods
        sessions: true,      // Include buffet sessions
      },
    });

    return new Response(JSON.stringify(buffets), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching buffets:", error); 

    return new Response(JSON.stringify({ error: "Error fetching buffets"}), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

