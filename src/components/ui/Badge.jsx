import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  icon,
  rounded = "full",
  className = "",
}) => {
  // Styles variants
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    info: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    credit:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  };

  // Sizes
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  // Roundness
  const roundness = {
    full: "rounded-full",
    md: "rounded-md",
    lg: "rounded-lg",
  };

  // Icons by variant
  const iconMap = {
    success: <FiCheck className="mr-1" />,
    danger: <FiX className="mr-1" />,
    warning: <FiAlertCircle className="mr-1" />,
    info: <FiInfo className="mr-1" />,
    default: null,
  };

  return (
    <span
      className={`inline-flex items-center font-medium ${variants[variant]} ${sizes[size]} ${roundness[rounded]} ${className}`}
    >
      {icon || iconMap[variant]}
      {children}
    </span>
  );
};

// Composant spécialisé pour les statuts
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    valid: {
      label: "Validé",
      variant: "success",
      icon: <FiCheck />,
    },
    failed: {
      label: "Échoué",
      variant: "danger",
      icon: <FiX />,
    },
    pending: {
      label: "En cours",
      variant: "warning",
      icon: <FiAlertCircle />,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} icon={config.icon}>
      {config.label}
    </Badge>
  );
};

// Composant spécialisé pour les crédits
export const CreditBadge = ({ credits }) => (
  <Badge variant="credit" icon={<FiHash className="mr-1" />}>
    {credits} Crédit{credits > 1 ? "s" : ""}
  </Badge>
);

export default Badge;
