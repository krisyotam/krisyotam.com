"use client"

const CORE_VALUES_DATA = {
  values: [
    { term: "Mitzvah", definition: "The keeping of the laws, statues, and commandments of YHWH." },
    { term: "Integrity", definition: "Acting with honesty, moral uprightness, and strong ethical principles." },
    { term: "Courage", definition: "The strength to face fear, difficulty, or pain without being overcome by it." },
    { term: "Humility", definition: "A modest or low view of one's importance; recognizing one's dependence on God." },
    { term: "Wisdom", definition: "The ability to make sound judgments and decisions based on knowledge and understanding." },
    { term: "Love", definition: "A selfless, sacrificial, and unconditional affection for others, reflecting the love of Christ." },
    { term: "Faithfulness", definition: "The quality of being loyal, trustworthy, and steadfast in commitment to God, family, and responsibilities." },
    { term: "Self-control", definition: "The ability to control one's emotions, behavior, and desires, especially in difficult situations." },
    { term: "Responsibility", definition: "The obligation to fulfill duties, both to God and others, with reliability and accountability." },
    { term: "Forgiveness", definition: "The act of pardoning someone who has wronged you, following the example of God's forgiveness." },
    { term: "Servanthood", definition: "A willingness to serve others selflessly, putting their needs above your own." },
    { term: "Gratitude", definition: "The quality of being thankful and showing appreciation to God for all blessings." },
    { term: "Diligence", definition: "Steady and earnest effort in doing something, with persistence and careful attention." },
    { term: "Purity", definition: "The quality of being morally clean, avoiding sin and remaining holy." },
    { term: "Peace-making", definition: "Actively working to create and maintain harmony, resolving conflicts in a godly way." },
    { term: "Generosity", definition: "The willingness to give freely and cheerfully to those in need." },
    { term: "Hope", definition: "The confident expectation of good things in the future, rooted in trust in God's promises." }
  ]
}

export default function CoreValues() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        Intellectual curiosity, authenticity, simplicity, and the pursuit of excellence in all endeavors.
        These principles guide both my personal and professional life.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Value</th>
              <th className="px-4 py-2 text-left text-foreground">Definition</th>
            </tr>
          </thead>
          <tbody>
            {CORE_VALUES_DATA.values.map((value, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="px-4 py-2 text-foreground">{value.term}</td>
                <td className="px-4 py-2 text-muted-foreground">{value.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 