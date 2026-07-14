import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Footer from "../components/landing/Footer";
import {
  Target,
  Heart,
  ShieldCheck,
  TrendingUp,
  Users,
  Brain,
  ArrowRight,
} from "lucide-react";

interface Value {
  icon: ReactNode;
  title: string;
  description: string;
}

const About = () => {
  const values: Value[] = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-green" />,
      title: "Trust & Security",
      description:
        "Your financial information is protected with industry-standard security and encryption.",
    },
    {
      icon: <Brain className="w-8 h-8 text-brand-green" />,
      title: "Innovation",
      description:
        "We build smarter budgeting tools powered by modern technology and AI.",
    },
    {
      icon: <Heart className="w-8 h-8 text-brand-green" />,
      title: "User First",
      description:
        "Every feature is designed to make managing money simple and stress-free.",
    },
    {
      icon: <Users className="w-8 h-8 text-brand-green" />,
      title: "Community",
      description:
        "Helping students, workers, entrepreneurs and families across Nigeria.",
    },
  ];

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-24">
        <div className="container-default text-center max-w-4xl">

          <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-brand-green font-semibold">
            About BudgetWise
          </span>

          <h1 className="text-5xl font-bold mt-6 text-brand-black">
            Helping Nigerians Build Better Financial Habits
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-8">
            BudgetWise is a modern budgeting platform that helps you track
            expenses, create budgets, save money and make smarter financial
            decisions.
          </p>

        </div>
      </section>

      {/* Story */}

      <section className="py-24">
        <div className="container-default grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <h2 className="text-4xl font-bold mb-6">
              Our Story
            </h2>

            <p className="text-gray-600 leading-8 mb-6">
              We created BudgetWise because many Nigerians struggle to know
              where their money goes every month.
            </p>

            <p className="text-gray-600 leading-8 mb-6">
              Instead of complicated spreadsheets, we built a beautiful,
              easy-to-use budgeting platform that helps anyone understand
              their finances.
            </p>

            <p className="text-gray-600 leading-8">
              Whether you're a student, salary earner or entrepreneur,
              BudgetWise helps you stay in control of your money.
            </p>

          </div>

          <div className="bg-green-50 rounded-3xl p-10">

            <TrendingUp className="w-16 h-16 text-brand-green mb-6" />

            <h3 className="text-3xl font-bold mb-4">
              Our Vision
            </h3>

            <p className="text-gray-600 leading-8">
              To become Africa's most trusted personal finance platform by
              helping millions achieve financial freedom.
            </p>

          </div>

        </div>
      </section>

      {/* Mission */}

      <section className="bg-gray-50 py-24">

        <div className="container-default">

          <div className="text-center mb-16">

            <span className="text-brand-green font-semibold">
              OUR MISSION
            </span>

            <h2 className="text-4xl font-bold mt-3">
              Why We Built BudgetWise
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <Target className="w-10 h-10 text-brand-green mb-5"/>

              <h3 className="text-xl font-bold mb-3">
                Smart Budgeting
              </h3>

              <p className="text-gray-600 leading-7">
                Easily create budgets and monitor your spending.
              </p>

            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <Brain className="w-10 h-10 text-brand-green mb-5"/>

              <h3 className="text-xl font-bold mb-3">
                AI Insights
              </h3>

              <p className="text-gray-600 leading-7">
                Receive personalized financial recommendations.
              </p>

            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <TrendingUp className="w-10 h-10 text-brand-green mb-5"/>

              <h3 className="text-xl font-bold mb-3">
                Financial Growth
              </h3>

              <p className="text-gray-600 leading-7">
                Build healthy money habits and reach your savings goals.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Values */}

      <section className="py-24">

        <div className="container-default">

          <div className="text-center mb-16">

            <span className="text-brand-green font-semibold">
              OUR VALUES
            </span>

            <h2 className="text-4xl font-bold mt-3">
              What Drives Us
            </h2>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white border rounded-3xl p-8 hover:shadow-xl transition"
              >
                {value.icon}

                <h3 className="text-xl font-bold mt-5 mb-3">
                  {value.title}
                </h3>

                <p className="text-gray-600 leading-7">
                  {value.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24">

        <div className="container-default">

          <div className="bg-brand-black rounded-3xl p-14 text-center">

            <h2 className="text-4xl font-bold text-white">
              Ready to Start Your Financial Journey?
            </h2>

            <p className="text-gray-300 mt-5 mb-8">
              Join thousands of Nigerians already using BudgetWise.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-brand-green hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition"
            >
              Get Started
              <ArrowRight size={20}/>
            </Link>

          </div>

        </div>

      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default About;