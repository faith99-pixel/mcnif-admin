import { prisma } from "@/lib/prisma";

export async function POST () {
    const user = await prisma.user.create({
        data: {
            userId: "Zoey",
            email: "zoezebedee3@gmail.com",
            roleName: "Admin",
        },
    })
    return new Response(JSON.stringify(user))
}