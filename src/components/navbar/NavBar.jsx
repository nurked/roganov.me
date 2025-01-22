import React, { useState } from "react";

export const NavBar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const handleClick = (item) => {
    setIsMenuOpen(false);
    setMobileDropdown(null);

    if (item === "Contact") {
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    }else if (item === "Portfolio") {
      document.getElementById("superhero").scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div
      className="w-full z-50 bg-[#0F67B1] border border-transparent shadow-input flex justify-between items-center px-4 py-2 sm:px-8 sm:py-6 max-w-full mx-auto sticky top-0"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {/* Logo */}
      <div className="w-1/3 ml-4">
        <div className="text-white font-bold text-xl"></div>
      </div>

      {/* Menu Items for Large Screens */}
      <div className="hidden sm:flex items-center space-x-6 w-2/3 justify-end mr-4">
        {/* Services Button */}
        {/* <div
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
        </div> */}

        {/* Products Button */}
        {/* <div
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
        </div> */}

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

      {/* Hamburger Button for Mobile Menu */}
      <div
        className="sm:hidden rounded-full flex items-center cursor-pointer"
        onClick={toggleMenu}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-11 right-0 w-52 bg-[#0F67B1] shadow-lg">
          <ul className="space-y-4 text-left">
            {/* Services Dropdown */}
            {/* 
<li
  className="relative"
  onClick={() => setMobileDropdown(mobileDropdown === "services" ? null : "services")}
>
  <p className="cursor-pointer text-white hover:opacity-90">Services</p>
  {mobileDropdown === "services" && (
    <div className="w-48 sm:w-46 bg-transparent shadow-lg rounded-lg">
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
</li>

{/* Products Dropdown */}
{/* 
<li
  className="relative"
  onClick={() => setMobileDropdown(mobileDropdown === "products" ? null : "products")}
>
  <p className="cursor-pointer text-white hover:opacity-90">Products</p>
  {mobileDropdown === "products" && (
    <div className="mt-2 w-48 sm:w-56 bg-transparent shadow-lg rounded-lg">
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
</li>
*/}

            {/* Portfolio */}
            <li>
              <p
                className="cursor-pointer text-white hover:opacity-90 px-2 mt-2"
                onClick={() => handleClick("Portfolio")}
              >
                Portfolio
              </p>
            </li>

            {/* Contact */}
            <li>
              <p
                className="cursor-pointer text-white hover:opacity-90 px-2 mb-2"
                onClick={() => handleClick("Contact")}
              >
                Contact
              </p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
