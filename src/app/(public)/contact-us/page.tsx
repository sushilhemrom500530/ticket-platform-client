import ContactForm from "@/src/components/contact-us";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - Ticket Platform",
    description:
        "Get in touch with Ticket Platform. Contact our team for event management, ticketing solutions, technical support, partnerships, and general inquiries.",
};

export default function ContactUsPage() {
    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto px-4">

                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        Contact Our Team
                    </span>

                    <h1 className="mt-6 text-4xl font-bold text-slate-900 md:text-6xl">
                        We'd Love to Hear From You
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Whether you're planning an event, need support,
                        have partnership opportunities, or simply want to
                        learn more about Ticket Platform, our team is here
                        to help.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="mt-20 grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8">
                        <h3 className="text-xl font-semibold">
                            Email Us
                        </h3>

                        <p className="mt-3 text-slate-600">
                            Send us your questions anytime.
                        </p>

                        <p className="mt-4 font-medium">
                            support@ticketplatform.com
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-8">
                        <h3 className="text-xl font-semibold">
                            Call Us
                        </h3>

                        <p className="mt-3 text-slate-600">
                            Speak directly with our support team.
                        </p>

                        <p className="mt-4 font-medium">
                            +880 1746-387409
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-8">
                        <h3 className="text-xl font-semibold">
                            Office Location
                        </h3>

                        <p className="mt-3 text-slate-600">
                            Visit our office during business hours.
                        </p>

                        <p className="mt-4 font-medium">
                            Dhaka, Bangladesh
                        </p>
                    </div>
                </div>

                {/* Contact Form + Info */}
                <div className="mt-24 grid gap-8 lg:grid-cols-2">

                    {/* Form */}
                    <ContactForm />

                    {/* Business Info */}
                    <div className="space-y-8">

                        <div className="rounded-3xl border border-slate-200 bg-white p-8">
                            <h2 className="text-2xl font-bold">
                                Business Hours
                            </h2>

                            <div className="mt-6 space-y-4 text-slate-600">
                                <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span>9:00 AM - 6:00 PM</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span>10:00 AM - 4:00 PM</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span>Closed</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-8">
                            <h2 className="text-2xl font-bold">
                                Why Contact Us?
                            </h2>

                            <ul className="mt-6 space-y-4 text-slate-600">
                                <li>✓ Event Management Assistance</li>
                                <li>✓ Ticketing Support</li>
                                <li>✓ Technical Help</li>
                                <li>✓ Partnership Opportunities</li>
                                <li>✓ Business Inquiries</li>
                                <li>✓ Product Feedback</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}