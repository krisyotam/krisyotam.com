import "../../notes.css";          

export default function NoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Wrap so the styles apply automatically */
  return <article className="note-content">{children}</article>;
}
