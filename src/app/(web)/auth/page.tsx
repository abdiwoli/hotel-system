"use client";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FormEvent, useEffect, useState } from "react";
import { signUp } from "next-auth-sanity/client";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const inputStyle = `
    mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm dark:bg-gray-800
    dark:text-gray-200 dark:border-gray-600 focus:ring-indigo-500 light:bg-white
    focus:border-indigo-500 focus:ring-1 dark:focus:ring-indigo-500 dark:focus:border-indigo-500
    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg 
`;



const defaultFormData = {
    name: "",
    email: "",
    password: "",
}

const Auth = () => {
    const [formData, setFormData] = useState(defaultFormData);

    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const url = searchParams.get("url") || "";

    useEffect(() => {
        if (session) {
            if (url) {
                const fixedUrl = url.startsWith("/") ? url : `/${url}`;
                router.push(fixedUrl);
            } else {
                router.push("/");
            }
        }
    }, [router, session, url]);

    const loginHandler = async () => {
        try {
            await signIn();
            router.push('/');
        } catch (error) {
            console.log(error)
            toast.error("some thing went wrong");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleForm = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const user = await signUp(formData);
            if (user) {
                toast.success("Account created successfully!");
            } else {
                toast.error("Error creating account. Please try again.");
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Form submission completed");
        } catch (error) {
            console.error("Error submitting form:", error);
        }
        finally {
            setFormData(defaultFormData);
        }
    };

    return (
        <section className="container mx-auto flex items-center justify-center h-screen">
            <div className=" shadow-md rounded-lg p-8 w-96">
                <div className="flex mb-8 items-center justify-between w-full">
                    <h1 className="text-2xl font-bold">Create account</h1>
                    <p className="text-gray-600">OR</p>
                    <span className="inline-flex items-center space-x-4">
                        <AiFillGithub
                            onClick={loginHandler}
                            className="text-2xl cursor-pointer transition duration-300 
                                       text-gray-600 hover:text-gray-800 dark:text-gray-400 
                                       dark:hover:text-gray-200"
                        />
                        <FcGoogle
                            onClick={loginHandler}
                            className="text-2xl cursor-pointer transition duration-300 
                                       text-gray-600 hover:text-gray-800 dark:text-gray-400 
                                       dark:hover:text-gray-200"
                        />
                    </span>
                </div>
                <form className="space-y-4" onSubmit={handleForm}>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={inputStyle}
                            name="name"
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className={inputStyle}
                            onChange={handleChange}
                            required
                            title="Please enter a valid email address."
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className={inputStyle}
                            onChange={handleChange}
                            required
                            minLength={8}
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                            title="Password must be at least 8 characters long, 
                                   include an uppercase letter, a lowercase letter, 
                                   a number, and a special character."
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            id="confirmPassword"
                            className={inputStyle}
                            type="password"
                            required
                            title="Please confirm your password."
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md 
                                   hover:bg-indigo-700 focus:outline-none focus:ring-2 
                                   focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Create Account
                    </button>
                    <button
                        type="button"
                        onClick={loginHandler}
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md 
                                   hover:bg-gray-700 focus:outline-none focus:ring-2 
                                   focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>

            </div>
        </section>
    );
};

export default Auth;