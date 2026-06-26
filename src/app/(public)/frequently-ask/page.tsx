import FAQContent from "@/src/components/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ - Ticket Platform",
    description:
        "Find answers to common questions about Ticket Platform.",
};

export default function FAQPage() {
    return <FAQContent />;
}