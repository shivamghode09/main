/**
 * Gravix - Form Components with Validation and Custom Features
 *
 * Features:
 * - Built-in Validation
 * - Customization Options
 * - Enhanced Components
 * - Extensible Architecture
 */

import { createComponent } from "../../index";

// Base validation function
const validateInput = (element, validationRules) => {
  if (!validationRules) return { isValid: true, message: "" };

  const value = element.value;
  let isValid = true;
  let message = "";

  if (validationRules.required && !value.trim()) {
    isValid = false;
    message = validationRules.requiredMessage || "This field is required";
  } else if (
    validationRules.minLength &&
    value.length < validationRules.minLength
  ) {
    isValid = false;
    message =
      validationRules.minLengthMessage ||
      `Minimum ${validationRules.minLength} characters required`;
  } else if (
    validationRules.maxLength &&
    value.length > validationRules.maxLength
  ) {
    isValid = false;
    message =
      validationRules.maxLengthMessage ||
      `Maximum ${validationRules.maxLength} characters allowed`;
  } else if (
    validationRules.pattern &&
    !new RegExp(validationRules.pattern).test(value)
  ) {
    isValid = false;
    message = validationRules.patternMessage || "Invalid format";
  } else if (validationRules.customValidator) {
    const customValidation = validationRules.customValidator(value);
    if (!customValidation.isValid) {
      isValid = false;
      message = customValidation.message || "Invalid value";
    }
  }

  return { isValid, message };
};

// Enhanced Input Component
export function input(props) {
  const {
    validation,
    onValidationChange,
    showValidation = true,
    className = "",
    errorClassName = "error",
    ...restProps
  } = props;

  const handleBlur = (e) => {
    if (validation) {
      const validationResult = validateInput(e.target, validation);
      if (onValidationChange) {
        onValidationChange(validationResult);
      }

      if (!validationResult.isValid && showValidation) {
        e.target.classList.add(errorClassName);
      } else {
        e.target.classList.remove(errorClassName);
      }
    }

    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return createComponent().create("input", {
    ...restProps,
    className: `${className} ${validation ? "validatable" : ""}`.trim(),
    onBlur: handleBlur,
  });
}

// Enhanced Textarea Component
export function textarea(props, ...children) {
  const {
    validation,
    onValidationChange,
    showValidation = true,
    className = "",
    errorClassName = "error",
    ...restProps
  } = props;

  const handleBlur = (e) => {
    if (validation) {
      const validationResult = validateInput(e.target, validation);
      if (onValidationChange) {
        onValidationChange(validationResult);
      }

      if (!validationResult.isValid && showValidation) {
        e.target.classList.add(errorClassName);
      } else {
        e.target.classList.remove(errorClassName);
      }
    }

    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return createComponent().create(
    "textarea",
    {
      ...restProps,
      className: `${className} ${validation ? "validatable" : ""}`.trim(),
      onBlur: handleBlur,
    },
    ...children
  );
}

// Enhanced Select Component
export function select(props, ...children) {
  const {
    validation,
    onValidationChange,
    showValidation = true,
    className = "",
    errorClassName = "error",
    ...restProps
  } = props;

  const handleChange = (e) => {
    if (validation) {
      const validationResult = validateInput(e.target, validation);
      if (onValidationChange) {
        onValidationChange(validationResult);
      }

      if (!validationResult.isValid && showValidation) {
        e.target.classList.add(errorClassName);
      } else {
        e.target.classList.remove(errorClassName);
      }
    }

    if (props.onChange) {
      props.onChange(e);
    }
  };

  return createComponent().create(
    "select",
    {
      ...restProps,
      className: `${className} ${validation ? "validatable" : ""}`.trim(),
      onChange: handleChange,
    },
    ...children
  );
}

// Enhanced Option Component
export function option(props, ...children) {
  // Option doesn't typically need validation, but we can add value formatting
  const { formatValue, value, ...restProps } = props;

  const formattedValue = formatValue ? formatValue(value) : value;

  return createComponent().create(
    "option",
    {
      ...restProps,
      value: formattedValue,
    },
    ...children
  );
}

// Enhanced Label Component with optional required marker
export function label(props, ...children) {
  const { required, requiredMark = "*", className = "", ...restProps } = props;

  return createComponent().create(
    "label",
    {
      ...restProps,
      className: `${className} ${required ? "required" : ""}`.trim(),
    },
    required ? [...children, requiredMark] : children
  );
}

// Enhanced Fieldset Component with validation summary
export function fieldset(props, ...children) {
  const {
    validationErrors = [],
    showValidationSummary = true,
    validationSummaryClassName = "validation-summary",
    ...restProps
  } = props;

  const validationSummary =
    showValidationSummary && validationErrors.length > 0
      ? createComponent().create(
          "div",
          { className: validationSummaryClassName },
          validationErrors.map((error, index) =>
            createComponent().create("div", { key: index }, error.message)
          )
        )
      : null;

  return createComponent().create(
    "fieldset",
    restProps,
    validationSummary,
    ...children
  );
}

// Form validation helper
export function validateForm(formElements) {
  const results = [];
  let isValid = true;

  formElements.forEach((element) => {
    if (element.props && element.props.validation) {
      const validationResult = validateInput(element, element.props.validation);
      if (!validationResult.isValid) {
        isValid = false;
        results.push({
          element,
          ...validationResult,
        });
      }
    }
  });

  return {
    isValid,
    errors: results,
  };
}
