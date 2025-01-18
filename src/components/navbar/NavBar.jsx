import React, { useState } from "react";

export const NavBar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleClick = (item) => {
    console.log(`Selected: ${item}`);
  };

  return (
    <div className="bg-sky-500">
      <div
        className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full z-50 bg-[#433D8B] rounded-full border border-transparent shadow-input flex justify-between space-x-4 px-4 py-2 sm:px-8 sm:py-6 max-w-screen-md mx-auto flex-wrap sm:flex-nowrap"
        onMouseLeave={() => setActiveDropdown(null)}
      >
        {/* Services Button */}
        <div
          className="relative cursor-pointer text-white hover:opacity-[0.9]"
          onMouseEnter={() => setActiveDropdown("services")}
        >
          Services
          {activeDropdown === "services" && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 sm:w-56 bg-white shadow-lg rounded-lg">
              <ul className="space-y-2 p-4">
                <li>
                  <p
                    className="cursor-pointer text-black hover:opacity-90"
                    onClick={() => handleClick("Web Design")}
                  >
                    Web Design
                  </p>
                </li>
                <li>
                  <p
                    className="cursor-pointer text-black hover:opacity-90"
                    onClick={() => handleClick("SEO")}
                  >
                    SEO
                  </p>
                </li>
                <li>
                  <p
                    className="cursor-pointer text-black hover:opacity-90"
                    onClick={() => handleClick("App Development")}
                  >
                    App Development
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Products Button */}
        <div
          className="relative cursor-pointer text-white hover:opacity-[0.9]"
          onMouseEnter={() => setActiveDropdown("products")}
        >
          Products
          {activeDropdown === "products" && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 sm:w-56 bg-white shadow-lg rounded-lg">
              <ul className="space-y-2 p-4">
                <li>
                  <p
                    className="cursor-pointer text-black hover:opacity-90"
                    onClick={() => handleClick("Product 1")}
                  >
                    Product 1
                  </p>
                </li>
                <li>
                  <p
                    className="cursor-pointer text-black hover:opacity-90"
                    onClick={() => handleClick("Product 2")}
                  >
                    Product 2
                  </p>
                </li>
                <li>
                  <p
                    className="cursor-pointer text-black hover:opacity-90"
                    onClick={() => handleClick("Product 3")}
                  >
                    Product 3
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <p
          className="cursor-pointer text-white hover:opacity-[0.9]"
          onMouseEnter={() => setActiveDropdown(null)}
          onClick={() => handleClick("Portfolio")}
        >
          Portfolio
        </p>

        {/* Contact */}
        <p
          className="cursor-pointer text-white hover:opacity-[0.9] w-full sm:w-auto text-center sm:text-left"
          onMouseEnter={() => setActiveDropdown(null)}
          onClick={() => handleClick("Contact")}
        >
          Contact
        </p>
      </div>
    </div>
  );
};
