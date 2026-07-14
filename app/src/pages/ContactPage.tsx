import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import Footer from "../components/landing/Footer";
import { useState } from "react";
import { toast } from "sonner";
import { contactAPI } from "@/services/api";

const Contact = () => {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
    });
      
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
      
        setLoading(true);
      
        try {
          await contactAPI.send(formData);
        
          toast.success("Message sent successfully!");
        
          setFormData({
            fullName: "",
            email: "",
            subject: "",
            message: "",
          });
        } catch (err: any) {
          toast.error(
            err.response?.data?.message ||
            "Something went wrong."
          );
        } finally {
          setLoading(false);
        }
    };

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-24">
        <div className="container-default max-w-4xl text-center">

          <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-brand-green font-semibold">
            Contact BudgetWise
          </span>

          <h1 className="text-5xl font-bold text-brand-black mt-6">
            We'd Love To Hear From You
          </h1>

          <p className="text-lg text-gray-600 mt-6 leading-8">
            Whether you have a question, feedback, partnership inquiry,
            or simply need help using BudgetWise, our team is always
            ready to assist you.
          </p>

        </div>
      </section>

      {/* Contact Cards */}

      <section className="py-20">

        <div className="container-default">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Email */}

            <div className="bg-white border rounded-3xl p-8 hover:shadow-xl transition">

              <Mail className="w-10 h-10 text-brand-green mb-5" />

              <h3 className="text-xl font-bold mb-3">
                Email
              </h3>

              <p className="text-gray-600">
                jcodesstudio@gmail.com
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Reply within 24 hours
              </p>

            </div>

            {/* Phone */}

            <div className="bg-white border rounded-3xl p-8 hover:shadow-xl transition">

              <Phone className="w-10 h-10 text-brand-green mb-5" />

              <h3 className="text-xl font-bold mb-3">
                Phone
              </h3>

              <p className="text-gray-600">
                +234 707 843 2313
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Mon - Fri (8AM - 6PM)
              </p>

            </div>

            {/* Address */}

            <div className="bg-white border rounded-3xl p-8 hover:shadow-xl transition">

              <MapPin className="w-10 h-10 text-brand-green mb-5" />

              <h3 className="text-xl font-bold mb-3">
                Address
              </h3>

              <p className="text-gray-600">
                Lagos, Nigeria
              </p>

              <p className="text-sm text-gray-400 mt-2">
                J.Code Studio Ltd
              </p>

            </div>

            {/* Hours */}

            <div className="bg-white border rounded-3xl p-8 hover:shadow-xl transition">

              <Clock className="w-10 h-10 text-brand-green mb-5" />

              <h3 className="text-xl font-bold mb-3">
                Working Hours
              </h3>

              <p className="text-gray-600">
                Monday - Friday
              </p>

              <p className="text-sm text-gray-400 mt-2">
                8:00AM - 6:00PM
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Contact Form */}

      <section className="pb-24">

        <div className="container-default">

          <div className="grid lg:grid-cols-2 gap-16">

            {/* Form */}

            <div>

              <h2 className="text-4xl font-bold mb-4">
                Send Us A Message
              </h2>

              <p className="text-gray-600 mb-8">
                Fill in the form below and we'll get back to you as soon as possible.
              </p>

              <form 
                onSubmit={handleSubmit}
                className="space-y-6">

                <div>

                  <label className="block mb-2 font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullName: e.target.value,
                        })
                    }
                    placeholder="John Doe"
                    className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-green"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                    }
                    placeholder="john@example.com"
                    className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-green"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Subject
                  </label>

                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                        setFormData({
                          ...formData,
                          subject: e.target.value,
                        })
                    }
                    placeholder="How can we help?"
                    className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-green"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Message
                  </label>

                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                        setFormData({
                          ...formData,
                          message: e.target.value,
                        })
                    }
                    placeholder="Write your message..."
                    className="w-full border rounded-xl px-5 py-4 outline-none resize-none focus:ring-2 focus:ring-brand-green"
                  />

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 bg-brand-green hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition"
                >
                  <Send size={18} />
                  {loading ? "Sending..." : "Send Message"}
                </button>

              </form>

            </div>

            {/* Help Card */}

            <div className="bg-gradient-to-br from-brand-green to-green-700 rounded-3xl p-10 text-white h-fit">

                <MessageCircle className="w-16 h-16 mb-8" />

                <h2 className="text-3xl font-bold mb-5">
                Need Immediate Help?
                </h2>

                <p className="text-green-100 leading-8 mb-8">
                    Our support team is always available to answer your
                    questions and help you make the most of BudgetWise.
                </p>

                <div className="space-y-5">

                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <span>Budget & Savings Support</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <span>Technical Assistance</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <span>Business Partnerships</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <span>General Enquiries</span>
                    </div>

                </div>

                <div className="mt-10 border-t border-white/20 pt-6">

                    <p className="text-green-100 text-sm">
                        Average Response Time
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                        Less than 24 Hours
                    </h3>

                </div>

            </div>

        </div>

    </div>

    </section>

    {/* FAQ */}

    <section className="bg-gray-50 py-24">

    <div className="container-default">

    <div className="text-center mb-16">

    <span className="text-brand-green font-semibold">
    FAQ
    </span>

    <h2 className="text-4xl font-bold mt-3">
    Frequently Asked Questions
    </h2>

    </div>

    <div className="space-y-6 max-w-4xl mx-auto">

    <div className="bg-white rounded-2xl p-8 shadow-sm">
    <h3 className="text-xl font-bold mb-3">
    Is BudgetWise free?
    </h3>

    <p className="text-gray-600 leading-7">
    Yes. BudgetWise offers a free version with powerful budgeting
    features. Premium tools may be added in future updates.
    </p>
    </div>

    <div className="bg-white rounded-2xl p-8 shadow-sm">
    <h3 className="text-xl font-bold mb-3">
    Is my financial data secure?
    </h3>

    <p className="text-gray-600 leading-7">
    Absolutely. We use modern encryption and secure authentication
    practices to keep your financial information protected.
    </p>
    </div>

    <div className="bg-white rounded-2xl p-8 shadow-sm">
    <h3 className="text-xl font-bold mb-3">
    Can I use BudgetWise on my phone?
    </h3>

    <p className="text-gray-600 leading-7">
    Yes. BudgetWise is fully responsive and works beautifully on
    phones, tablets and desktops.
    </p>
    </div>

    <div className="bg-white rounded-2xl p-8 shadow-sm">
    <h3 className="text-xl font-bold mb-3">
    Who can use BudgetWise?
    </h3>

    <p className="text-gray-600 leading-7">
    Students, salary earners, business owners, freelancers and
    anyone who wants better control of their finances.
    </p>
    </div>

    </div>

    </div>

    </section>

        {/* Social */}

        <section className="py-24">

        <div className="container-default text-center">

        <span className="text-brand-green font-semibold">
        CONNECT WITH US
        </span>

        <h2 className="text-4xl font-bold mt-3 mb-12">
        Follow BudgetWise
        </h2>

        <div className="flex flex-wrap justify-center gap-6">

        <a
        href="#"
        className="border rounded-xl px-8 py-4 hover:bg-brand-green hover:text-white transition"
        >
        Twitter
        </a>

        <a
        href="#"
        className="border rounded-xl px-8 py-4 hover:bg-brand-green hover:text-white transition"
        >
        Instagram
        </a>

        <a
        href="#"
        className="border rounded-xl px-8 py-4 hover:bg-brand-green hover:text-white transition"
        >
        LinkedIn
        </a>

        <a
        href="#"
        className="border rounded-xl px-8 py-4 hover:bg-brand-green hover:text-white transition"
        >
        GitHub
        </a>

        </div>

        </div>

        </section>

        {/* CTA */}

        <section className="pb-24">

        <div className="container-default">

        <div className="bg-brand-black rounded-3xl p-14 text-center">

        <h2 className="text-4xl font-bold text-white">
        Ready To Take Control Of Your Money?
        </h2>

        <p className="text-gray-300 mt-5 mb-8">
        Start tracking your expenses, managing your budget and achieving
        your financial goals with BudgetWise.
        </p>

        <Link
        to="/register"
        className="inline-flex items-center gap-3 bg-brand-green hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition"
        >
        Get Started
        <ArrowRight size={20} />
        </Link>

        </div>

        </div>

        </section>

        <Footer />

        </div>
    );
};

export default Contact;