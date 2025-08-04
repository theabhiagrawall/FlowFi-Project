'use client';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-4">
        <p>
          Welcome to <strong>FlowFi</strong>! These Terms of Service (“Terms”)
          govern your use of the FlowFi application, website, and related
          services (collectively, the “Service”). By using FlowFi, you agree to
          these Terms. Please read them carefully.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. About FlowFi</h2>
        <p>
          FlowFi is a digital wallet application that allows you to send,
          receive, and manage money electronically. Our services include
          peer-to-peer transfers, bill payments, merchant transactions, and
          other financial features similar to leading digital payment platforms.
        </p>

        <h2 className="text-xl font-semibold mt-8">2. Eligibility</h2>
        <p>
          You must be at least 18 years old and capable of entering into a
          legally binding agreement to use FlowFi. You must also comply with
          applicable laws and regulations in your jurisdiction.
        </p>

        <h2 className="text-xl font-semibold mt-8">3. Account Registration</h2>
        <p>
          To use FlowFi, you must create an account by providing accurate and
          complete information. You are responsible for maintaining the
          confidentiality of your account credentials and for all activities
          under your account.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. KYC & Verification</h2>
        <p>
          For compliance with financial regulations, FlowFi may require you to
          complete Know Your Customer (KYC) verification. This may include
          submitting documents such as Aadhaar, PAN, or other government-issued
          IDs.
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Acceptable Use</h2>
        <p>You agree not to use FlowFi for:</p>
        <ul className="list-disc list-inside">
          <li>Illegal activities or transactions</li>
          <li>Money laundering or terrorist financing</li>
          <li>Fraudulent activities or scams</li>
          <li>Infringing the rights of others</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">6. Transactions</h2>
        <p>
          All transactions made via FlowFi are final unless otherwise required
          by law. You are responsible for verifying transaction details before
          confirming. FlowFi is not liable for incorrect transfers caused by
          your error.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. Fees & Charges</h2>
        <p>
          FlowFi may charge fees for certain transactions or services. These
          fees will be disclosed before you confirm a transaction.
        </p>

        <h2 className="text-xl font-semibold mt-8">8. Security</h2>
        <p>
          We use industry-standard security measures to protect your data and
          funds. However, you are responsible for safeguarding your device,
          passwords, and PINs.
        </p>

        <h2 className="text-xl font-semibold mt-8">9. Suspension & Termination</h2>
        <p>
          We may suspend or terminate your account if we detect suspicious
          activity, violation of these Terms, or as required by law.
        </p>

        <h2 className="text-xl font-semibold mt-8">10. Limitation of Liability</h2>
        <p>
          FlowFi will not be liable for indirect, incidental, or consequential
          damages arising from your use of the Service, except as required by
          law.
        </p>

        <h2 className="text-xl font-semibold mt-8">11. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. If changes are material,
          we will notify you via email or in-app notification.
        </p>

        <h2 className="text-xl font-semibold mt-8">12. Contact Us</h2>
        <p>
          If you have questions about these Terms, contact us at:{' '}
          <a
            href="mailto:support@flowfi.com"
            className="text-blue-600 underline"
          >
            support@flowfi.com
          </a>
        </p>
      </section>
    </div>
  )
}
