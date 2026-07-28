import {requireAuth} from "@/shared/auth/requireAuth";

import {ProfileContent} from "./ProfileContent";

export default async function ProfilePage() {
    await requireAuth();

    return <ProfileContent />;
}