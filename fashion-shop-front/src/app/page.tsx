import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const categories = [
    {
      name: "Clothes",
      image: "/fashion16.jpg",
    },
    {
      name: "Bags",
      image: "/fashion25.jpg",
    },
    {
      name: "Accessories",
      image: "/fashion31.jpg",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Glass",
      description: "Description",
      price: "70.000",
      originalPrice: "100.000",
      image: "/fashion29.jpg",
      badge: "-30%",
      badgeColor: "bg-pink-500",
    },
    {
      id: 2,
      name: "Small",
      description: "Description",
      price: "300.000",
      originalPrice: "500.000",
      image: "/fashion5.jpg",
      badge: null,
    },
    {
      id: 3,
      name: "Coat",
      description: "Description",
      price: "200.000",
      originalPrice: "1.000.000",
      image: "/fashion9.jpg",
      badge: "-50%",
      badgeColor: "bg-pink-500",
    },
    {
      id: 4,
      name: "Passion",
      description: "Description",
      price: "200.000",
      image: "/fashion22.jpg",
      badge: "New",
      badgeColor: "bg-teal-500",
    },
    {
      id: 5,
      name: "Grifo",
      description: "Description",
      price: "Rp 1.500.000",
      image: "/fashion17.jpg",
      badge: "-30%",
      badgeColor: "bg-pink-500",
    },
    {
      id: 6,
      name: "Muggo",
      description: "Description",
      price: "Rp 150.000",
      image: "/fashion26.jpg",
      badge: "New",
      badgeColor: "bg-teal-500",
    },
    {
      id: 7,
      name: "Set Fashion II",
      description: "Description",
      price: "$ 1.000.000",
      originalPrice: "$ 1.700.000",
      image: "/fashion10.jpg",
      badge: "-30%",
      badgeColor: "bg-pink-500",
    },
    {
      id: 8,
      name: "Set Fashion I",
      description: "Description",
      price: "$ 500.000",
      image: "/fashion11.jpg",
      badge: "New",
      badgeColor: "bg-teal-500",
    },
  ];

  const fashionImages = [
    "/fashion8.jpg",
    "/fashion12.jpg",
    "/fashion2.jpg",
    "/fashion14.jpg",
    "/fashion15.jpg",
    "/fashion18.jpg",
  ];

  return (
    <div>
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Background Image */}
        <Image
          src="/fashion28.jpg"
          alt="Sunglasses and accessories"
          fill
          className="object-cover"
          priority
        />

        {/* Content Card Flotante */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 lg:p-12 rounded-lg shadow-2xl max-w-xl">
            <p className="text-sm text-gray-700 mb-2 tracking-wide">
              New Arrival
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 mb-4 leading-tight">
              Discover Our
              <br />
              New Collection
            </h1>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis.
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-10 py-3 rounded transition-colors shadow-lg hover:shadow-xl">
              BUY NOW
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href="/shop"
              className="group cursor-pointer"
            >
              <div className="relative h-80 overflow-hidden rounded-lg mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.badge && (
                  <span
                    className={`absolute top-4 right-4 ${product.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="absolute inset-0 bg-transparent-100 bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-3">
                <button className="bg-white text-gray-900 px-6 py-2 rounded hover:bg-gray-100 transition-colors">
                  Add to cart
                </button>
                <div className="flex space-x-4 text-white">
                  <button className="hover:text-amber-400 transition-colors flex items-center space-x-1">
                    <span>Share</span>
                  </button>
                  <button className="hover:text-amber-400 transition-colors flex items-center space-x-1">
                    <span>Details</span>
                  </button>
                  <button className="hover:text-amber-400 transition-colors flex items-center space-x-1">
                    <span>Like</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white font-semibold px-12 py-3 rounded transition-colors">
            Show More
          </button>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-2">Look fashionable and stylish</p>
          <h2 className="text-3xl font-bold text-gray-900">#FashionShop</h2>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          <div className="col-span-2 md:col-span-2 row-span-2 relative h-96 md:h-[600px] overflow-hidden rounded-sm">
            <Image
              src={fashionImages[0]}
              alt="Fashion look 1"
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="col-span-2 md:col-span-3 relative h-48 md:h-72 overflow-hidden rounded-sm">
            <Image
              src={fashionImages[1]}
              alt="Fashion look 2"
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="col-span-2 md:col-span-3 row-span-2 relative h-96 md:h-[600px] overflow-hidden rounded-sm">
            <Image
              src={fashionImages[2]}
              alt="Fashion look 3"
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="col-span-2 md:col-span-3 relative h-48 md:h-80 overflow-hidden rounded-sm">
            <Image
              src={fashionImages[3]}
              alt="Fashion look 4"
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
