interface PredictionCardProps {
  statement: string;
  confidence: number;
  date: string;
  category: string;
  status?: "active" | "hidden" | "dropped" | "succeeded" | "failed"; // Optional
  expiryDate?: string; // Optional
}

export function PredictionCard({
  statement,
  confidence,
  date,
  category,
  status = "active", // Default value
  expiryDate = "", // Default value
}: PredictionCardProps) {
  // Safe date formatting
  const formatDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime())
      ? "Invalid Date"
      : parsedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const formattedDate = formatDate(date);
  const formattedExpiryDate = expiryDate ? formatDate(expiryDate) : "No expiry";

  // Status color and label
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200";
      case "succeeded":
        return "bg-neutral-300 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-100";
      case "failed":
        return "bg-neutral-300 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-100";
      case "dropped":
        return "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
      case "hidden":
        return "bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400";
      default:
        return "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "active":
        return "Active";
      case "succeeded":
        return "Succeeded";
      case "failed":
        return "Failed";
      case "dropped":
        return "Dropped";
      case "hidden":
        return "Hidden";
      default:
        return "Active";
    }
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm bg-white dark:bg-neutral-900 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{statement}</h3>
        <span className="text-sm bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-neutral-700 dark:text-neutral-300 ml-4">
          {category}
        </span>
      </div>

      <div className="mt-5 mb-3">
        <div className="flex items-center">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mr-3">
            <div
              className="h-2 bg-neutral-500 dark:bg-neutral-400 rounded-full"
              style={{ width: `${confidence}%` }}
              aria-label={`Confidence level: ${confidence}%`}
            ></div>
          </div>
          <span className="text-sm font-medium w-24 text-right text-neutral-700 dark:text-neutral-300">
            {confidence}% confidence
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">Predicted on {formattedDate}</div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 ml-auto">Expires on {formattedExpiryDate}</div>
        <div className={`text-xs px-2 py-1 rounded-full ml-2 ${getStatusColor()}`}>{getStatusLabel()}</div>
      </div>
    </div>
  );
}