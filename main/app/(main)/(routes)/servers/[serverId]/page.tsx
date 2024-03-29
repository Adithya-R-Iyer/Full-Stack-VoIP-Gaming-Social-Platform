import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
    params: {
        serverId: string;
    }
}


const ServerIdPage = async(
    { params } : ServerIdPageProps
) => {

    const profile = await currentProfile();
    const serverId = params.serverId;

    if(!profile) {
        return redirectToSignIn();
    }

    if(!serverId) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })

    const initialChannel = server?.channels[0];

    if(initialChannel?.name !== "general") {
        return null;
    }

    return redirect(`/servers/${server?.id}/channels/${initialChannel?.id}`);
}
 
export default ServerIdPage;