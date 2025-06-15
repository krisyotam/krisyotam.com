interface PredictionCardProps {
  statement: string;
  confidence: number;
  date: string;
  category: string;
  status?: "active" | "hidden" | "dropped" | "succeeded" | "failed";
  expiryDate?: string;
}

export function PredictionCard({
  statement,
  confidence,
  date,
  category,
  status = "active",
  expiryDate = "",
}: PredictionCardProps) {
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

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200";
      case "succeeded":
        return "bg-neutral-300 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-100";
      case "failed":
        return "bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100";
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
    <div className="border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 shadow-sm transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{statement}</h3>
        <span className="shrink-0 text-sm bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-neutral-700 dark:text-neutral-300">
          {category}
        </span>
      </div>

      <div className="mt-5 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full">
            <div
              className="h-2 bg-neutral-500 dark:bg-neutral-400 rounded-full transition-all duration-300"
              style={{ width: `${confidence}%` }}
              aria-label={`Confidence level: ${confidence}%`}
            ></div>
          </div>
          <span className="text-sm font-medium w-24 text-right text-neutral-700 dark:text-neutral-300">
            {confidence}% confidence
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">Predicted on {formattedDate}</div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">Expires on {formattedExpiryDate}</div>
        <div className={`text-xs px-2 py-1 rounded-full ml-auto ${getStatusColor()}`}>{getStatusLabel()}</div>
      </div>
    </div>
  );
}