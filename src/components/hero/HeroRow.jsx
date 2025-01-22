import React from "react";
import PropTypes from "prop-types";

export const HeroRow = ({ children, className, layout = "full" }) => {
  const getChildWrapper = (child, index) => {
    const baseClasses = "w-full sm:w-full";

    const layoutClasses = {
      full: "md:w-full",
      split: "md:w-1/2",
    };

    const finalLayout =
      layout === "split" && React.Children.count(children) === 1
        ? "full"
        : layout;

    return (
      <div
        key={index}
        className={`${baseClasses} ${layoutClasses[finalLayout]}`}
      >
        {child}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col md:flex-row w-full gap-4 ${className || ""}`}
    >
      {React.Children.map(children, (child, index) =>
        getChildWrapper(child, index),
      )}
    </div>
  );
};

HeroRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  layout: PropTypes.oneOf(["full", "split"]),
};
