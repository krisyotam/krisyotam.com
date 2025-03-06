import ContactForm from "@/components/ContactForm"

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <div className="prose dark:prose-invert mb-8">
          <p>
            I would be elated to receive requests for research ideas, collaboration opportunities, or even just to hear about projects you're working on. Your insights and ideas are invaluable, and I'm always eager to engage in meaningful discussions that could lead to exciting new ventures or breakthroughs.
          </p>
          <p>
            Whether you're a fellow researcher, a curious mind with a burning question, or someone with a unique perspective to share, I encourage you to reach out using the form below. Your message could be the start of something extraordinary – a collaboration that pushes the boundaries of knowledge, a question that sparks a new line of inquiry, or a friendship that transcends academic pursuits.
          </p>
          <p>
            Don't hesitate to share your thoughts, no matter how preliminary or ambitious they might seem. In the world of research and innovation, sometimes the most groundbreaking ideas start with a simple conversation. I'm here to listen, discuss, and potentially collaborate on ideas that could shape our understanding of the world.
          </p>
          <p>
            So, whether you're looking to collaborate, ask a question, share a research idea, seek advice, or simply connect, please use the form below. I look forward to hearing from you and exploring the possibilities that await!
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
