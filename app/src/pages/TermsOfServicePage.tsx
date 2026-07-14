import Footer from "../components/landing/Footer";

const Terms = () => {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-24">
        <div className="container-default max-w-4xl text-center">

          <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-brand-green font-semibold">
            Terms of Service
          </span>

          <h1 className="text-5xl font-bold text-brand-black mt-6">
            Terms & Conditions
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-8">
            Please read these Terms of Service carefully before using
            BudgetWise. By accessing or using our platform, you agree to
            comply with these terms.
          </p>

          <p className="text-gray-500 mt-4">
            Last Updated: July 2026
          </p>

        </div>
      </section>

      {/* Content */}

      <section className="py-24">
        <div className="container-default max-w-5xl">

          <div className="space-y-14">

            <div>
              <h2 className="text-3xl font-bold mb-5">
                1. Acceptance of Terms
              </h2>

              <p className="text-gray-600 leading-8">
                By creating an account or using BudgetWise, you agree to be
                bound by these Terms of Service. If you do not agree with any
                part of these terms, please discontinue using the platform.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                2. Eligibility
              </h2>

              <p className="text-gray-600 leading-8">
                You must be at least 18 years old or have permission from a
                parent or guardian to use BudgetWise. You are responsible for
                ensuring that your use of the platform complies with applicable
                laws.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                3. User Accounts
              </h2>

              <p className="text-gray-600 leading-8 mb-4">
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </p>

              <ul className="list-disc pl-6 text-gray-600 leading-8 space-y-2">
                <li>Provide accurate registration information.</li>
                <li>Keep your password secure.</li>
                <li>Notify us immediately of unauthorized access.</li>
                <li>You are responsible for all activities under your account.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                4. Acceptable Use
              </h2>

              <p className="text-gray-600 leading-8 mb-4">
                You agree not to:
              </p>

              <ul className="list-disc pl-6 text-gray-600 leading-8 space-y-2">
                <li>Use BudgetWise for unlawful purposes.</li>
                <li>Attempt to hack, reverse engineer, or disrupt our services.</li>
                <li>Upload malicious software or harmful content.</li>
                <li>Share false or misleading financial information.</li>
                <li>Violate the rights of other users.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                5. Financial Information
              </h2>

              <p className="text-gray-600 leading-8">
                BudgetWise provides budgeting tools and financial insights for
                educational and planning purposes only. We do not provide
                professional financial, investment, tax, or legal advice.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                6. Privacy
              </h2>

              <p className="text-gray-600 leading-8">
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect, use, and protect your
                information.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                7. Intellectual Property
              </h2>

              <p className="text-gray-600 leading-8">
                All content, branding, software, designs, logos, and graphics
                on BudgetWise are the property of BudgetWise and protected by
                applicable intellectual property laws. You may not reproduce,
                copy, or redistribute any content without written permission.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                8. Limitation of Liability
              </h2>

              <p className="text-gray-600 leading-8">
                BudgetWise is provided "as is" without warranties of any kind.
                We are not responsible for financial losses, indirect damages,
                or any consequences arising from the use of our platform.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                9. Account Termination
              </h2>

              <p className="text-gray-600 leading-8">
                We reserve the right to suspend or terminate accounts that
                violate these Terms of Service or misuse the platform.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                10. Changes to These Terms
              </h2>

              <p className="text-gray-600 leading-8">
                We may update these Terms of Service from time to time.
                Continued use of BudgetWise after updates means you accept the
                revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-5">
                11. Contact Us
              </h2>

              <p className="text-gray-600 leading-8">
                If you have questions regarding these Terms of Service, please
                contact us through the Contact page or email our support team.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default Terms;