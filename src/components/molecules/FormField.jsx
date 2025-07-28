import React from "react";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  error, 
  type = "input",
  required = false,
  className = "",
  ...props 
}) => {
  const Component = type === "textarea" ? Textarea : Input;

  return (
    <div className={className}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Component error={!!error} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;