"use client"

import { Card, CardContent } from "@/components/ui/card"

const PERSONAL_PHILOSOPHY_CONTENT = "I am at heart an ascetic, a stoic, an epicurean, a naturalist, and an agrarian. My essence is minimalist, shaped by the wisdom of John Maeda's laws of simplicity. Law 1—'The simplest way to achieve simplicity is through thoughtful reduction'—resonates deeply with me. Too often, we clutter our lives with the unnecessary, and by trimming away the superfluous, we create clarity in our work and our thoughts. Law 5—'Simplicity and complexity need each other'—reminds me that simplicity is not shallow nor fickle. It is the act of transforming thought into action, mind into matter, with as little distortion as possible. This can only be achieved through the creation of complex systems that, though tedious, endure and stand the test of time. For me, health is foundational. I follow an alkaline diet most of the time, with room for exploring recipes from different cultures. I embrace raw foods—herbs and fruits—believing the vitality of the mind is key to success. The mind must be nurtured, for it shapes all things, from the simplest task to the highest achievement. Growth is a pursuit of continual evolution. Surround yourself with those who are smarter than you, for they will challenge you to grow. Yet, it is just as vital to be in spaces where you are the wisest, for it is there you can teach, share, and pay it forward. Above all, the 613 commandments are my guiding light, the moral compass that shapes my every action. These principles are the bedrock upon which I build my life, for they anchor me to a higher purpose."

export default function PersonalPhilosophy() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        My personal approach to life, learning, and living with intention.
      </p>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4 text-foreground">My Philosophy</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {PERSONAL_PHILOSOPHY_CONTENT}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Principles</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Continuous learning and intellectual growth</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Balance between tradition and innovation</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Thoughtful creation over mindless consumption</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Approach</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Systematic thinking with room for intuition</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Balancing depth and breadth of knowledge</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                <span>Embracing complexity while seeking clarity</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 