import "../../blog.css";          

export default function NoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Don't wrap the entire content in note-content anymore */
  return <>{children}</>;
}
