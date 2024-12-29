import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";



export async function POST(request: Request) {
    const clerkUser = await currentUser()

    if (!clerkUser) redirect("/sign-in")

    const { id, emailAddresses, imageUrl, username } = clerkUser;
    // Get the current user from your database
    const user = {
        id,
        info: {
            id,
            name: username!,
            email: emailAddresses[0].emailAddress,
            avatar: imageUrl,
            color: getUserColor(id),
        }
    }


    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.info.email,
            groupIds: [],
        },
        { userInfo: user.info },
    );

    return new Response(body, { status });
}