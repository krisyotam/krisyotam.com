// Simple anchor component for the blog footer
interface AProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export function A({ children, ...props }: AProps) {
  return (
    <a 
      className="underline hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      {...props}
    >
      {children}
    </a>
  );
} 