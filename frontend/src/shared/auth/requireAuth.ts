import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function requireAuth(): Promise<void> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Cookie: cookieHeader },
    });

    if (!res.ok) {
        redirect("/");
    }
}