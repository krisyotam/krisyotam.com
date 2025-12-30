import "../til.css";          

export default function TilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Don't wrap the entire content in til-content anymore */
  return <>{children}</>;
}
