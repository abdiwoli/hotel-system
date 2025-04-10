import React from 'react';

const ContactPage = () => {
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
            <p className="text-center mb-6">
                We'd love to hear from you! Please fill out the form below or reach out to us directly.
            </p>
            <div className="max-w-2xl mx-auto">
                <form className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Your Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Your Message"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Send Message
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p>Or reach us directly at:</p>
                    <p className="text-indigo-600 font-medium">contact@munawarahotel.com</p>
                    <p>Phone: +123 456 7890</p>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;