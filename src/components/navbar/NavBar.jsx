import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (item) => {
    setIsMenuOpen(false);

    if (item === "Contact") {
      navigate("/#contact");
      setTimeout(() => {
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (item === "Portfolio") {
      navigate("/#superhero");
      setTimeout(() => {
        document
          .getElementById("superhero")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-full z-50 bg-[#0F67B1] border border-transparent shadow-input flex justify-between items-center px-4 py-2 sm:px-8 sm:py-6 max-w-full mx-auto sticky top-0">
      {/* Logo */}
      <div className="w-1/3 ml-4">
        <Link
          to="/"
          className="text-white font-bold text-xl"
          onClick={() => window.scrollTo(0, 0)}
        ></Link>
      </div>

      {/* Menu Items for Large Screens */}
      <div className="hidden sm:flex items-center space-x-6 w-2/3 justify-end mr-4">
        {/* Portfolio */}
        <Link
          to="/#superhero"
          className="cursor-pointer text-white hover:opacity-[0.9]"
          onClick={() => handleClick("Portfolio")}
        >
          Portfolio
        </Link>

        {/* Contact */}
        <Link
          to="/#contact"
          className="cursor-pointer text-white hover:opacity-[0.9] w-full sm:w-auto text-center sm:text-left"
          onClick={() => handleClick("Contact")}
        >
          Contact
        </Link>

        {/* Birthday Link */}
        <Link
          to="/birthday-2026"
          className="cursor-pointer text-white hover:opacity-[0.9]"
          onClick={() => window.scrollTo(0, 0)}
        >
          Birthday 2026
        </Link>
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
            <li>
              <Link
                to="/#superhero"
                className="cursor-pointer text-white hover:opacity-90 px-2 mt-2 block"
                onClick={() => handleClick("Portfolio")}
              >
                Portfolio
              </Link>
            </li>

            <li>
              <Link
                to="/#contact"
                className="cursor-pointer text-white hover:opacity-90 px-2 mb-2 block"
                onClick={() => handleClick("Contact")}
              >
                Contact
              </Link>
            </li>

            <li>
              <Link
                to="/birthday-2026"
                className="cursor-pointer text-white hover:opacity-90 px-2 mb-2 block"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Birthday 2026
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
