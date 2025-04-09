const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
