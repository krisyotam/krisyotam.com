import "../../libers.css";          

export default function LiberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Don't wrap the entire content in liber-content anymore */
  return <>{children}</>;
}
