import { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiSave,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiChevronDown,
} from "react-icons/fi";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      disabled = false,
      rounded = "md",
      fullWidth = false,
      className = "",
      ...props
    },
    ref
  ) => {
    // Variants
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary:
        "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white focus:ring-gray-500",
      success:
        "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      outline:
        "border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-blue-500",
      ghost:
        "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-blue-500",
      icon: "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full",
    };

    // Sizes
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    // Rounded
    const roundedStyles = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };

    // Icon mapping
    const iconMap = {
      add: <FiPlus className="w-4 h-4" />,
      save: <FiSave className="w-4 h-4" />,
      edit: <FiEdit2 className="w-4 h-4" />,
      delete: <FiTrash2 className="w-4 h-4" />,
      download: <FiDownload className="w-4 h-4" />,
      dropdown: <FiChevronDown className="w-4 h-4" />,
    };

    // Determine icon to display
    const IconComponent = typeof icon === "string" ? iconMap[icon] : icon;

    // Base classes
    const baseClasses = `inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
      roundedStyles[rounded]
    } ${fullWidth ? "w-full" : ""}`;

    // Combined classes
    const combinedClasses = `${baseClasses} ${variants[variant]} ${
      sizes[size]
    } ${
      disabled || loading ? "opacity-70 cursor-not-allowed" : ""
    } ${className}`;

    return (
      <motion.button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { scale: 1.03 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <>
            {iconPosition === "left" && IconComponent && (
              <span className={`mr-2 ${children ? "" : "mr-0"}`}>
                {IconComponent}
              </span>
            )}
            {children}
            {iconPosition === "right" && IconComponent && (
              <span className={`ml-2 ${children ? "" : "ml-0"}`}>
                {IconComponent}
              </span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

// Variantes spécialisées
export const AddButton = (props) => <Button icon="add" {...props} />;

export const SaveButton = (props) => (
  <Button icon="save" variant="success" {...props} />
);

export const EditButton = ({ compact = false, ...props }) => (
  <Button
    icon="edit"
    variant={compact ? "ghost" : "secondary"}
    size={compact ? "sm" : "md"}
    {...props}
  />
);

export const DeleteButton = ({ compact = false, ...props }) => (
  <Button
    icon="delete"
    variant={compact ? "ghost" : "danger"}
    size={compact ? "sm" : "md"}
    {...props}
  />
);

export const IconButton = ({ icon, ...props }) => (
  <Button icon={icon} variant="icon" size="sm" rounded="full" {...props} />
);

export default Button;
