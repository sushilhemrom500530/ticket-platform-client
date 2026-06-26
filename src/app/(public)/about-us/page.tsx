import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Ticket Platform",
    description: "Ticket Platform is a modern event management and ticketing solution dedicated to helping organizers create, manage, promote, and sell tickets for events of every size. Since 2020, we have been empowering businesses, communities, educational institutions, and event organizers with reliable technology that simplifies the entire event lifecycle.",
    keywords: ["Event Management", "Ticketing", "Event Platform", "Ticket Platform", "Event Organizer", "Event Management System", "Event Ticketing System", "Event Management Software", "Event Ticketing Software"],
    openGraph: {
        title: "About Us - Ticket Platform",
        description: "Ticket Platform is a modern event management and ticketing solution dedicated to helping organizers create, manage, promote, and sell tickets for events of every size. Since 2020, we have been empowering businesses, communities, educational institutions, and event organizers with reliable technology that simplifies the entire event lifecycle.",
        url: "https://ticket-platform-frontend.vercel.app/about-us",
        siteName: "Ticket Platform",
        images: [
            {
                url: "https://ticket-platform-frontend.vercel.app/api/og?title=About%20Us%20-%20Ticket%20Platform",
                width: 1200,
                height: 630,
                alt: "About Us - Ticket Platform",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us - Ticket Platform",
        description: "Ticket Platform is a modern event management and ticketing solution dedicated to helping organizers create, manage, promote, and sell tickets for events of every size. Since 2020, we have been empowering businesses, communities, educational institutions, and event organizers with reliable technology that simplifies the entire event lifecycle.",
        images: ["https://ticket-platform-frontend.vercel.app/api/og?title=About%20Us%20-%20Ticket%20Platform"],
    },
}

export default function AboutUsPage() {
    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto px-4">

                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        Since 2020
                    </span>

                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
                        About Ticket Platform
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Ticket Platform is a modern event management and ticketing
                        solution dedicated to helping organizers create, manage,
                        promote, and sell tickets for events of every size.
                        Since 2020, we have been empowering businesses,
                        communities, educational institutions, and event organizers
                        with reliable technology that simplifies the entire event
                        lifecycle.
                    </p>
                </div>

                {/* Stats */}
                <div className="mt-20 grid gap-6 md:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 p-8 text-center bg-white">
                        <h3 className="text-3xl font-bold">2020</h3>
                        <p className="mt-2 text-gray-600">Founded</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-8 text-center bg-white">
                        <h3 className="text-3xl font-bold">100+</h3>
                        <p className="mt-2 text-gray-600">Events Managed</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-8 text-center bg-white">
                        <h3 className="text-3xl font-bold">24/7</h3>
                        <p className="mt-2 text-gray-600">Support</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-8 text-center bg-white">
                        <h3 className="text-3xl font-bold">100%</h3>
                        <p className="mt-2 text-gray-600">Digital Experience</p>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="mt-24 grid gap-8 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Our Mission
                        </h2>

                        <p className="mt-4 text-gray-600 leading-7">
                            Our mission is to make event management effortless by
                            providing a powerful, secure, and user-friendly platform
                            that connects organizers with attendees. We aim to
                            simplify ticket sales, registrations, event promotion,
                            and attendee engagement through innovative technology.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Our Vision
                        </h2>

                        <p className="mt-4 text-gray-600 leading-7">
                            We envision a future where organizing and attending
                            events is seamless, accessible, and enjoyable for
                            everyone. Our goal is to become a trusted global
                            platform for event management and ticketing solutions.
                        </p>
                    </div>
                </div>

                {/* What We Do */}
                <div className="mt-24">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">
                            What We Do
                        </h2>

                        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
                            We provide end-to-end event management solutions for
                            conferences, concerts, workshops, seminars, festivals,
                            sports events, corporate gatherings, and community
                            programs.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6">
                            <h3 className="text-xl font-semibold">
                                Event Creation
                            </h3>
                            <p className="mt-3 text-gray-600">
                                Easily create and manage events with customized
                                event pages and registration forms.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6">
                            <h3 className="text-xl font-semibold">
                                Online Ticketing
                            </h3>
                            <p className="mt-3 text-gray-600">
                                Secure ticket sales, digital ticket delivery,
                                and attendee management in one platform.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6">
                            <h3 className="text-xl font-semibold">
                                Event Analytics
                            </h3>
                            <p className="mt-3 text-gray-600">
                                Track registrations, ticket sales, attendee
                                engagement, and event performance with real-time
                                insights.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mt-24 rounded-3xl bg-gray-900 p-10 text-white">
                    <div className="max-w-4xl">
                        <h2 className="text-3xl font-bold">
                            Why Choose Ticket Platform?
                        </h2>

                        <ul className="mt-8 grid gap-4 md:grid-cols-2">
                            <li>✓ Modern and intuitive user experience</li>
                            <li>✓ Secure payment and ticket management</li>
                            <li>✓ Fast event setup and publishing</li>
                            <li>✓ Real-time reporting and analytics</li>
                            <li>✓ Reliable customer support</li>
                            <li>✓ Scalable for small and large events</li>
                        </ul>
                    </div>
                </div>

                {/* Closing */}
                <div className="mt-24 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold">
                        Creating Memorable Event Experiences
                    </h2>

                    <p className="mt-6 text-lg text-gray-600 leading-8">
                        For over five years, Ticket Platform has helped event
                        organizers deliver successful experiences through
                        streamlined event management and smart ticketing
                        technology. We remain committed to innovation, reliability,
                        and helping our clients create unforgettable events.
                    </p>
                </div>
            </div>
        </section>
    );
}