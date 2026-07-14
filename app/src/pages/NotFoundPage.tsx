import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import Footer from "../components/landing/Footer";

const NotFound = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white flex items-center justify-center">

        <div className="container-default">

          <div className="max-w-3xl mx-auto text-center">

            {/* Icon */}

            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-100 mb-8">
              <SearchX className="w-16 h-16 text-brand-green" />
            </div>

            {/* 404 */}

            <h1 className="text-8xl md:text-9xl font-black text-brand-green">
              404
            </h1>

            <h2 className="text-4xl md:text-5xl font-bold text-brand-black mt-6">
              Page Not Found
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-2xl mx-auto">
              Oops! The page you're looking for doesn't exist, may have been
              moved, or the URL might be incorrect.
            </p>

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-3 bg-brand-green hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition"
              >
                <Home size={20} />
                Back Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-3 border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-8 py-4 rounded-xl font-semibold transition"
              >
                <ArrowLeft size={20} />
                Go Back
              </button>

            </div>

            {/* Helpful Links */}

            <div className="mt-20">

              <h3 className="text-2xl font-bold mb-8">
                You may be looking for
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <Link
                  to="/"
                  className="border rounded-2xl p-6 hover:shadow-lg hover:border-brand-green transition"
                >
                  <h4 className="font-bold text-lg">
                    Home
                  </h4>

                  <p className="text-gray-500 mt-2 text-sm">
                    Return to the landing page.
                  </p>
                </Link>

                <Link
                  to="/about"
                  className="border rounded-2xl p-6 hover:shadow-lg hover:border-brand-green transition"
                >
                  <h4 className="font-bold text-lg">
                    About
                  </h4>

                  <p className="text-gray-500 mt-2 text-sm">
                    Learn more about BudgetWise.
                  </p>
                </Link>

                <Link
                  to="/contact"
                  className="border rounded-2xl p-6 hover:shadow-lg hover:border-brand-green transition"
                >
                  <h4 className="font-bold text-lg">
                    Contact
                  </h4>

                  <p className="text-gray-500 mt-2 text-sm">
                    Reach out to our support team.
                  </p>
                </Link>

                <Link
                  to="/login"
                  className="border rounded-2xl p-6 hover:shadow-lg hover:border-brand-green transition"
                >
                  <h4 className="font-bold text-lg">
                    Login
                  </h4>

                  <p className="text-gray-500 mt-2 text-sm">
                    Access your BudgetWise account.
                  </p>
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default NotFound;