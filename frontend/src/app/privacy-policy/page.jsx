export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        This Privacy Policy explains how FlowFi (“we”, “our”, or “us”) collects,
        uses, stores, and protects your personal information when you use our
        digital wallet services. By using FlowFi, you agree to the terms of this
        Privacy Policy.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
      <p>We may collect the following information when you use FlowFi:</p>
      <ul className="list-disc ml-6">
        <li>Personal details: Name, email address, phone number, date of birth</li>
        <li>Financial information: Bank account details, UPI ID, card details</li>
        <li>Transaction history: Payments sent, received, and purchase records</li>
        <li>Device information: IP address, browser type, device identifiers</li>
        <li>Location data: When required for fraud prevention or transaction validation</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul className="list-disc ml-6">
        <li>Process transactions and payments</li>
        <li>Verify your identity and prevent fraud</li>
        <li>Provide customer support</li>
        <li>Improve app features and user experience</li>
        <li>Comply with legal and regulatory requirements</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">3. Sharing Your Information</h2>
      <p>We do not sell your personal data. We may share your information with:</p>
      <ul className="list-disc ml-6">
        <li>Payment processors and banking partners</li>
        <li>Government or law enforcement agencies (when required by law)</li>
        <li>Service providers assisting with app operations</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">4. Data Security</h2>
      <p>
        We use encryption, secure servers, and strict access controls to protect
        your data. However, no method of transmission over the internet is 100% secure,
        and we cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">5. Your Rights</h2>
      <p>
        You have the right to request access to, correction of, or deletion of
        your personal data. You can also request to limit certain processing of
        your data.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">6. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with the updated date.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">7. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, contact us at{" "}
        <a href="mailto:privacy@flowfi.com" className="text-blue-600 underline">
          privacy@flowfi.com
        </a>.
      </p>
    </div>
  );
}
