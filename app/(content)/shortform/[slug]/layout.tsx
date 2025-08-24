import "../shortform.css";          

export default function ShortformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Don't wrap the entire content in shortform-content anymore */
  return <>{children}</>;
}
