import "../now.css";          

export default function NowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Don't wrap the entire content in now-content anymore */
  return <>{children}</>;
}
