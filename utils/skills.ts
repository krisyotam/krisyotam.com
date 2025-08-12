export interface SkillCategory {
    id: string
    name: string
    color: {
      bg: string
      border: string
      text: string
      hover: string
    }
    skills: string[]
  }
  
  export interface SkillsData {
    skillCategories: SkillCategory[]
  }
  
  export interface SkillItem {
    skill: string
    categoryId: string
    categoryName: string
    color: {
      bg: string
      border: string
      text: string
      hover: string
    }
  }
  
  export interface CoreSkillsProps {
    data?: SkillsData
    className?: string
  }
  
  export type ViewType = "bento" | "category"
  
  