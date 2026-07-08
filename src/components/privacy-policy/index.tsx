
const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 my-24">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 md:p-12 border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                        <p>
                            Your privacy is paramount. This Privacy Policy outlines how our platform collects, uses, and protects the personal information you provide when using our event management and ticketing services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and billing information.</li>
                            <li><strong>Event Data:</strong> Details regarding tickets purchased, event attendance, and event creation history.</li>
                            <li><strong>Technical Data:</strong> IP address, browser type, and usage patterns collected via cookies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Data</h2>
                        <p>We use your information to facilitate seamless event experiences, including:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Processing ticket transactions and issuing digital tickets.</li>
                            <li>Communicating event updates, cancellations, or changes.</li>
                            <li>Improving our platform's security and user interface.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing and Security</h2>
                        <p>
                            We do not sell your personal data. We only share information with third-party payment processors or event organizers strictly to fulfill the services you have requested. We implement industry-standard encryption to protect your financial data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions regarding your data or this policy, please reach out to our support team at <a href="mailto:support@ticketplatform.com" className="text-blue-600 hover:underline">support@ticketplatform.com</a>.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500">
                    Last updated: July 5, 2026
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;