import "../../conspiracies.css";          

export default function ConspiracyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Don't wrap the entire content in conspiracy-content anymore */
  return <>{children}</>;
}