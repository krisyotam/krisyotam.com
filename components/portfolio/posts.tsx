"use client";

interface PostsProps {
  isActive: boolean;
}

export function Posts({ isActive }: PostsProps) {
  if (!isActive) return null;

  return (
    <div className="w-full space-y-8">
      {/* Work section */}
      <section>
        <h2 className="text-base font-semibold mb-4">Work</h2>
  <div className="space-y-2 w-full">
          {[{
            title: 'WP Engine',
            subtitle: 'Senior Product Designer',
            date: '2022 - Present'
          },{
            title: 'Delicious Brains - acquired by WP Engine',
            subtitle: 'Senior Product Designer',
            date: '2021 - 2022'
          },{
            title: 'BaseKit',
            subtitle: 'Design Director',
            date: '2014 - 2021'
          },{
            title: 'Koan',
            subtitle: 'UI Designer',
            date: '2013 - 2014'
          },{
            title: 'Simpleweb',
            subtitle: 'Designer & Frontend Developer',
            date: '2010 - 2013'
          }].map((job, i) => (
            <div key={i} className="w-full border bg-card p-4 flex items-center justify-between rounded-none hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <div>
                <div className="text-sm font-semibold line-clamp-2">{job.title}</div>
                <div className="text-sm text-muted-foreground">{job.subtitle}</div>
              </div>
              <div className="text-sm text-muted-foreground">{job.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Companies grid */}
      <section>
        <h2 className="text-base font-semibold mb-4">Some companies I've worked with</h2>
  <div className="w-full grid grid-cols-3 gap-2 border bg-card p-4 rounded-none">
          {['amazon','fasthosts','google','name.com','nationwide','telefonica'].map((c) => (
            <div key={c} className="w-full flex items-center justify-center py-6 border text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <span className="uppercase text-xs font-medium tracking-wide">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* People I've worked with */}
      <section>
        <h2 className="text-base font-semibold mb-4">People I've worked with</h2>
        <div className="w-full border bg-card p-4 rounded-none">
          <blockquote className="border-l-2 pl-4 italic text-muted-foreground mb-4">“I've had the pleasure of working with Dale on many projects over many years now. He brings a magical touch to every design he works on and all our shared users benefit.”</blockquote>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm font-semibold">Liam Gladdy</div>
              <div className="text-sm text-muted-foreground">Senior Developer at WP Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* About this site */}
      <section>
        <h2 className="text-base font-semibold mb-4">About this site</h2>
        <div className="border bg-card p-4 rounded-none">
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Designed and built on a Mac using Figma &amp; Nova</li>
            <li>Powered by WordPress and Advanced Custom Fields</li>
            <li>Hosted with Digital Ocean &amp; managed using Laravel Forge</li>
            <li>Tracking data using Rybbit, open-source analytics</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
