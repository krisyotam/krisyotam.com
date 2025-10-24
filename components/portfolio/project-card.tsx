"use client";

interface Project {
  name: string;
  url: string;
  src: string;
  description: string;
  category: string;
  date: string;
}

interface Category {
  name: string;
  slug: string;
}

interface ProjectCardProps {
  project: Project;
  categories: Category[];
}

export function ProjectCard({ project, categories }: ProjectCardProps) {
  const categoryName = categories.find(cat => cat.slug === project.category)?.name || project.category;

  const handleClick = () => {
    window.open(project.url, '_blank');
  };

  return (
    <div
      className="border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      {/* Cover Image Area - Using 16:9 aspect ratio */}
      <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
        {project.src ? (
          <img 
            src={project.src} 
            alt={project.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="text-muted-foreground text-xs text-center p-4">${project.name}</div>`;
              }
            }}
          />
        ) : (
          <div className="text-muted-foreground text-xs text-center p-4">
            {project.name}
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="p-3">
        <h3 className="font-medium text-xs mb-1 line-clamp-2">{project.name}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{categoryName}</span>
          <span>{new Date(project.date).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
