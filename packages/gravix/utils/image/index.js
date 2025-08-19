/**
 * Gravix Optimized Image
 *
 * Features:
 * - Responsive Image Support
 * - Customizable Behavior
 * - Performance Focused and many more
 */

import { img } from "../..";

/**
 * Creates an optimized image with lazy loading and blur effect
 * @param {Object} props - Image properties
 * @param {string} props.src - Image source URL (required)
 * @param {string} [props.alt] - Alt text
 * @param {number} [props.width] - Image width
 * @param {number} [props.height] - Image height
 * @param {string} [props.class] - CSS class names
 * @param {boolean} [props.lazy=true] - Enable lazy loading
 * @param {boolean} [props.blur=true] - Enable blur effect
 * @param {string} [props.blurDataURL] - Low-res placeholder
 * @param {string} [props.loading='lazy'] - Loading behavior
 * @param {string} [props.sizes] - Responsive sizes
 * @param {string} [props.srcset] - Responsive srcset
 * @param {Object} [props.style] - Inline styles
 * @returns {HTMLElement} - Optimized image element
 */
export function optimizedImg(props) {
  const {
    src,
    alt = "",
    width,
    height,
    class: className = "",
    lazy = true,
    blur = true,
    blurDataURL,
    loading = "lazy",
    sizes,
    srcset,
    style = {},
    ...rest
  } = props;

  if (!src) {
    throw new Error("src is required for optimizedImg");
  }

  // Prepare image props
  const imgProps = {
    alt,
    width,
    height,
    class: className,
    sizes,
    srcset,
    style: { ...style },
    ...rest,
  };

  // Handle lazy loading
  if (lazy) {
    imgProps.loading = loading;
  }

  // Handle blur effect
  if (blur) {
    Object.assign(imgProps.style, {
      transition: "filter 0.5s ease, opacity 0.5s ease",
      filter: "blur(10px)",
      opacity: "0.9",
    });

    // Use provided blurDataURL or create SVG placeholder
    imgProps.src = blurDataURL || createPlaceholderSVG(width, height);

    // Load actual image after creation
    setTimeout(() => {
      const imgElement = document.querySelector(`img[src="${imgProps.src}"]`);
      if (imgElement) {
        imgElement.onload = function () {
          if (imgElement.src !== src) {
            imgElement.src = src;
          }
          setTimeout(() => {
            imgElement.style.filter = "none";
            imgElement.style.opacity = "1";
          }, 100);
        };
        imgElement.onerror = function () {
          console.error("Failed to load image:", src);
          imgElement.style.filter = "none";
          imgElement.style.opacity = "1";
        };
      }
    }, 0);
  } else {
    imgProps.src = src;
  }

  return img(imgProps);
}

/**
 * Creates SVG placeholder
 * @private
 */
function createPlaceholderSVG(width, height) {
  const aspectRatio = width && height ? `viewBox='0 0 ${width} ${height}'` : "";
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ${aspectRatio}%3E%3Crect width='100%' height='100%' fill='%23f5f5f5'/%3E%3C/svg%3E`;
}
