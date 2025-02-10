// import React from "react";
import PropTypes from "prop-types";

export const HeroCard = ({ heroData, className, fallbackImage, children }) => {
  const { image, description, title, subtitle } = heroData;

  return (
    <div
      className={`flex flex-col m-5 md:flex-row rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      {/* Only render image section if image is provided */}
      {(image || fallbackImage) && (
        <div className="w-full md:w-1/2">
          <img
            src={image || fallbackImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content section - takes full width if no image */}
      <div
        className={`w-full ${image || fallbackImage ? "md:w-1/2" : "w-full"} p-6 bg-gray-100 flex flex-col`}
      >
        {/* Title section */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{title}</h3>
            )}
            {subtitle && (
              <h4 className="text-lg text-gray-600 italic">{subtitle}</h4>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-700 flex-grow">{description}</p>

        {/* Additional content */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

HeroCard.propTypes = {
  heroData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  fallbackImage: PropTypes.string,
  children: PropTypes.node,
};

HeroCard.defaultProps = {
  className: "",
  fallbackImage: null,
  children: null,
};
