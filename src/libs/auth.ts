import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { SanityAdapter, SanityCredentials } from "next-auth-sanity";
import sanityClient from "./sanity";


export const AuthOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        SanityCredentials(sanityClient)
    ],
    session: {
        strategy: "jwt",
    },
    adapter: SanityAdapter(sanityClient),
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: async ({ session, token }) => {
            if (!token.email) {
                console.error("Missing email in token!");
                return session;
            }

            const userEmail = token.email;

            try {
                const userIdObject = await sanityClient.fetch<{ _id: string }>(
                    `*[_type == "user" && email == $email][0] {
                    _id
                }`,
                    { email: userEmail }
                );

                console.log("Sanity User:", userIdObject);

                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: userIdObject?._id ?? null
                    }
                };
            } catch (error) {
                console.error("Sanity Fetch Error:", error);
                return session;
            }
        }
    }
}