import PrivacyPolicy from "@/src/components/privacy-policy";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Your Platform Name",
    description: "Read our privacy policy to understand how we handle your data, protect your information, and manage your event ticketing experience securely.",

};
export default function PrivacyPolicyPage() {
    return <PrivacyPolicy />;
}