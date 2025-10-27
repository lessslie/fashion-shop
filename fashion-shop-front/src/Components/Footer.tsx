import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Fashion Shop.
            </h3>
            <p className="text-gray-600 text-sm">Store address</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Payment Options
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Privacy Policies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Newsletter
            </h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
              />
              <button className="px-4 py-2 bg-gray-900 text-white rounded-r-md hover:bg-gray-800 transition-colors text-sm font-medium">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            2025 Fashion Shop. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
