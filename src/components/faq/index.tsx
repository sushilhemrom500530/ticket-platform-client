"use client";

import { Collapse, Input, Button } from "antd";
import BorderAccordion from "../accordion";
import Link from "next/link";

const faqData = [
    {
        title: "How do I create an event?",
        content:
            "After creating an account, navigate to your dashboard and click the 'Create Event' button. Fill in event details, configure tickets, and publish your event.",
    },
    {
        title: "What types of events can I host?",
        content:
            "You can host conferences, workshops, seminars, concerts, festivals, sports events, corporate meetings, webinars, and community gatherings.",
    },
    {
        title: "How are tickets delivered to attendees?",
        content:
            "Once registration or payment is completed, attendees automatically receive digital tickets via email and can access them from their account dashboard.",
    },
    {
        title: "Can I manage attendee registrations?",
        content:
            "Yes. Organizers can view attendee lists, track registrations, export attendee data, and manage check-ins from the dashboard.",
    },
    {
        title: "Does Ticket Platform support paid events?",
        content:
            "Absolutely. You can create both free and paid events with secure online payment processing and ticket management.",
    },
    {
        title: "Can I edit my event after publishing?",
        content:
            "Yes. Event details such as descriptions, schedules, venues, and ticket settings can be updated before the event begins.",
    },
    {
        title: "Can I issue refunds to attendees?",
        content:
            "Yes. Organizers can process refunds according to their refund policy and payment gateway settings.",
    },
    {
        title: "Is Ticket Platform mobile-friendly?",
        content:
            "Yes. Both organizers and attendees can access Ticket Platform seamlessly from desktop, tablet, and mobile devices.",
    },
];

export const faqCategories = [
    {
        title: "Getting Started",
        items: [
            {
                title: "How do I create an event?",
                content: "Create an account and click Create Event.",
            },
            {
                title: "Can I host free and paid events?",
                content: "Yes, both free and paid events are supported.",
            },
        ],
    },

    {
        title: "Ticketing & Registration",
        items: [
            {
                title: "How are tickets delivered?",
                content: "Tickets are automatically emailed to attendees.",
            },
            {
                title: "Can I track registrations?",
                content: "Yes, through the organizer dashboard.",
            },
        ],
    },

    {
        title: "Payments & Refunds",
        items: [
            {
                title: "Which payment methods are supported?",
                content: "Multiple secure payment gateways are supported.",
            },
            {
                title: "Can I issue refunds?",
                content: "Yes, organizers can manage refunds.",
            },
        ],
    },
];
export default function FAQContent() {
    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto px-4">

                {/* Hero */}
                <div className="mx-auto max-w-4xl text-center">
                    <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        Help Center
                    </span>

                    <h1 className="mt-6 text-4xl font-bold md:text-6xl">
                        Frequently Asked Questions
                    </h1>

                    <p className="mt-6 text-lg text-slate-600 lg:w-2/3 w-full mx-auto">
                        Everything you need to know about
                        Ticket Platform, event management,
                        registrations, and ticketing.
                    </p>
                </div>

                {/* Categories */}
                <div className="mt-20 grid gap-6 md:grid-cols-4">
                    {[
                        "Event Creation",
                        "Ticketing",
                        "Payments",
                        "Support",
                    ].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all"
                        >
                            <h3 className="font-semibold">
                                {item}
                            </h3>
                        </div>
                    ))}
                </div>


                <div className="max-w-5xl mx-auto border border-gray-200 rounded-2xl bg-white p-6 mt-6">
                    <div className="mb-8 text-center">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                            Knowledge Base
                        </span>

                        <h2 className="mt-4 text-3xl font-bold text-gray-900">
                            Frequently Asked Questions
                        </h2>

                        <p className="mt-3 text-gray-600 w-full lg:w-2/3 mx-auto">
                            Find answers to common questions about event creation,
                            ticketing, registrations, payments, and attendee management.
                        </p>
                    </div>
                    <BorderAccordion
                        items={faqData}
                        color="#2563eb"
                    />
                </div>


                {/* CTA */}
                <div className="mt-24 rounded-3xl bg-slate-900 p-12 text-center text-white">
                    <h2 className="text-3xl font-bold">
                        Still Have Questions?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-slate-300">
                        Our support team is here to help.
                        Contact us anytime and we'll be
                        happy to assist you.
                    </p>

                    <Link href="/contact-us">
                        <Button
                            type="primary"
                            size="large"
                            className="mt-8"
                        >
                            Contact Support
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}