import { Link } from "react-router-dom";
import Footer from "../components/landing/Footer";
import { ShieldCheck, Lock, Database, Eye, Mail, ArrowRight } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="bg-white">

        {/* Hero */}

        <section className="bg-gradient-to-b from-green-50 to-white py-24">
          <div className="container-default max-w-4xl text-center">

            <span className="inline-block bg-green-100 text-brand-green px-5 py-2 rounded-full font-semibold">
              Privacy Policy
            </span>

            <h1 className="text-5xl font-bold mt-6 text-brand-black">
              Your Privacy Matters
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8">
              At BudgetWise, protecting your personal information is one of our
              highest priorities. This Privacy Policy explains what information
              we collect, why we collect it, and how we keep it secure.
            </p>

          </div>
        </section>

        {/* Intro */}

        <section className="py-20">
          <div className="container-default max-w-5xl">

            <div className="grid lg:grid-cols-2 gap-10">

              <div className="bg-white border rounded-3xl p-10 shadow-sm">

                <ShieldCheck className="w-12 h-12 text-brand-green mb-6" />

                <h2 className="text-3xl font-bold mb-4">
                  Our Commitment
                </h2>

                <p className="text-gray-600 leading-8">
                  BudgetWise is committed to protecting your privacy. We only
                  collect information necessary to provide budgeting tools,
                  improve your experience, and keep your account secure.
                </p>

              </div>

              <div className="bg-green-50 rounded-3xl p-10">

                <Lock className="w-12 h-12 text-brand-green mb-6" />

                <h2 className="text-3xl font-bold mb-4">
                  Secure by Design
                </h2>

                <p className="text-gray-600 leading-8">
                  We use encryption, secure authentication, and industry best
                  practices to safeguard your information from unauthorized
                  access.
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* Policy Sections */}

        <section className="py-20 bg-gray-50">
          <div className="container-default max-w-5xl space-y-12">

            <div>
              <h2 className="text-3xl font-bold mb-4">
                Information We Collect
              </h2>

              <p className="text-gray-600 leading-8">
                We may collect your name, email address, account information,
                budgeting data, financial preferences, and usage statistics to
                improve our services.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">
                How We Use Your Information
              </h2>

              <ul className="list-disc pl-6 text-gray-600 leading-8 space-y-2">
                <li>Provide budgeting and expense tracking services.</li>
                <li>Personalize your dashboard and recommendations.</li>
                <li>Improve app performance and user experience.</li>
                <li>Respond to support requests.</li>
                <li>Protect against fraud and unauthorized access.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">
                Data Protection
              </h2>

              <div className="grid md:grid-cols-3 gap-8 mt-8">

                <div className="bg-white rounded-3xl p-8 shadow-sm">
                  <Database className="w-10 h-10 text-brand-green mb-4" />
                  <h3 className="font-bold text-xl mb-3">
                    Secure Storage
                  </h3>
                  <p className="text-gray-600 leading-7">
                    Your data is stored securely using trusted cloud services.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm">
                  <Lock className="w-10 h-10 text-brand-green mb-4" />
                  <h3 className="font-bold text-xl mb-3">
                    Encryption
                  </h3>
                  <p className="text-gray-600 leading-7">
                    Sensitive information is encrypted both during transmission
                    and while stored.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm">
                  <Eye className="w-10 h-10 text-brand-green mb-4" />
                  <h3 className="font-bold text-xl mb-3">
                    Transparency
                  </h3>
                  <p className="text-gray-600 leading-7">
                    We never sell your personal information to third parties.
                  </p>
                </div>

              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">
                Cookies
              </h2>

              <p className="text-gray-600 leading-8">
                BudgetWise uses cookies and similar technologies to remember
                your preferences, keep you signed in, and analyze website
                traffic for a better experience.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">
                Your Rights
              </h2>

              <p className="text-gray-600 leading-8">
                You have the right to access, update, or delete your personal
                information. You may also request a copy of the data we store
                about you at any time.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">
                Changes to This Policy
              </h2>

              <p className="text-gray-600 leading-8">
                We may update this Privacy Policy occasionally. Any changes will
                be posted on this page along with the updated revision date.
              </p>
            </div>

          </div>
        </section>

        {/* Contact */}

        <section className="py-24">
          <div className="container-default">

            <div className="bg-brand-black rounded-3xl p-14 text-center">

              <Mail className="w-14 h-14 text-brand-green mx-auto mb-6" />

              <h2 className="text-4xl font-bold text-white">
                Questions About Your Privacy?
              </h2>

              <p className="text-gray-300 mt-5 mb-8 max-w-2xl mx-auto">
                If you have questions about this Privacy Policy or how we handle
                your information, we're here to help.
              </p>

              <Link
                to="/contact"
                className="inline-flex items-center gap-3 bg-brand-green hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition"
              >
                Contact Us
                <ArrowRight size={20} />
              </Link>

            </div>

          </div>
        </section>

      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;