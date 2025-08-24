import "../../links.css";          

export default function LinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Don't wrap the entire content in link-content anymore */
  return <>{children}</>;
}
