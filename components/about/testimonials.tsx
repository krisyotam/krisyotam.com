import { AnimatedTestimonials } from "../ui/animated-testimonials";
import testimonials from "@/data/testimonials.json";

export default function TestimonialsSection() {
  return (
    <section className="w-full flex flex-col items-center py-2">
      <AnimatedTestimonials testimonials={testimonials} />
      <a
        href="/surveys/home-page-comment"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block px-5 py-2 border border-border rounded-none bg-muted text-muted-foreground hover:bg-accent transition text-sm font-medium shadow-sm"
      >
        Leave Your Own
      </a>
    </section>
  );
}
