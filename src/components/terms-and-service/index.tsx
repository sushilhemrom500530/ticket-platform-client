
const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 my-24">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 md:p-12 border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using our event management platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Account Responsibility</h2>
                        <p>
                            Users are responsible for maintaining the confidentiality of their account credentials. You are fully responsible for all activities that occur under your account, including ticket sales and event management actions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Ticket Purchases and Refunds</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Purchases:</strong> All transactions are final unless otherwise specified by the event organizer.</li>
                            <li><strong>Refunds:</strong> Refund policies are determined solely by the event organizer. Our platform facilitates the request but does not guarantee approval.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Prohibited Conduct</h2>
                        <p>You agree not to use the platform for:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Unauthorized ticket scalping or reselling at inflated prices.</li>
                            <li>Impersonating others or creating fraudulent event listings.</li>
                            <li>Distributing malicious code or attempting to breach platform security.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
                        <p>
                            Our platform provides the infrastructure for event management. We are not responsible for the quality, safety, or occurrence of the events themselves; these responsibilities lie with the respective event organizers.
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

export default TermsOfService;