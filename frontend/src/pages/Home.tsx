import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Smart Shopping, Smarter Choices
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Discover personalized product recommendations powered by AI. Find exactly what you need with our intelligent shopping assistant.
          </p>
          <div className="mt-10">
            <Link
              to="/recommendations"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose SmartCart?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Experience the future of e-commerce with our AI-powered features
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                AI-Powered Recommendations
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Get personalized product suggestions based on your preferences and shopping history.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Smart Search
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Find products faster with our intelligent search that understands your intent.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Price Optimization
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Get the best deals with our price tracking and optimization features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to start shopping smarter?</span>
            <span className="block text-primary-600">Get started today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/recommendations"
                className="btn btn-primary text-lg px-8 py-3"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/products"
                className="btn btn-secondary text-lg px-8 py-3"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 