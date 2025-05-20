"use client"

import mySitesData from "@/data/my-sites.json"

export default function MySites() {
  return (
    <div className="py-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2 text-left text-foreground">Name</th>
              <th className="px-4 py-2 text-left text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {mySitesData.sites.map((site, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="px-4 py-2 text-foreground">
                  <a
                    href={site.link}
                    target="_blank"
                    data-no-preview="true"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition-colors"
                  >
                    {site.name}
                  </a>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{site.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 