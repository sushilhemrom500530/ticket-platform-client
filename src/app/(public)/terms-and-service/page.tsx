import TermsOfService from "@/src/components/terms-and-service";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Your Platform Name",
    description: "Review our Terms of Service governing the use of our event management and ticketing platform. Learn about your responsibilities, account safety, and event policies.",

};

export default function TermsOfServicePage() {
    return <TermsOfService />;
}