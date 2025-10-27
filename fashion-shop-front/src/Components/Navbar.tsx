import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, User, Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Frame 168.png"
              alt="Fashion Shop Logo"
              width={140}
              height={40}
              className="w-70 h-10"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <User size={20} />
            </Link>
            <button className="text-gray-700 hover:text-gray-900 transition-colors">
              <Search size={20} />
            </button>
            <Link
              href="/favorites"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
