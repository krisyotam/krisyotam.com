export interface FamilyMember {
    id: string
    name: string
    birthDate?: string
    deathDate?: string
    imageUrl?: string
    bio?: string
    parentIds?: string[]
    spouseIds?: string[]
    childrenIds?: string[]
  }
  
  export interface FamilyTree {
    members: FamilyMember[]
    rootMemberId: string
  }
  
  // Sample family tree data
  export const familyData: FamilyTree = {
    rootMemberId: "person1",
    members: [
      {
        id: "person1",
        name: "John Smith",
        birthDate: "1950-05-15",
        imageUrl: "/elderly-man-glasses.png",
        bio: "Family patriarch, retired engineer",
        spouseIds: ["person2"],
        childrenIds: ["person3", "person4", "person5"],
      },
      {
        id: "person2",
        name: "Mary Smith",
        birthDate: "1952-08-22",
        imageUrl: "/placeholder.svg?key=16lbi",
        bio: "Retired teacher, loves gardening",
        spouseIds: ["person1"],
        childrenIds: ["person3", "person4", "person5"],
      },
      {
        id: "person3",
        name: "Robert Smith",
        birthDate: "1975-03-12",
        imageUrl: "/middle-aged-man-contemplative.png",
        bio: "Software developer, married with two children",
        parentIds: ["person1", "person2"],
        spouseIds: ["person6"],
        childrenIds: ["person7", "person8"],
      },
      {
        id: "person4",
        name: "Jennifer Wilson",
        birthDate: "1978-11-28",
        imageUrl: "/placeholder.svg?key=z33vg",
        bio: "Doctor, married with one child",
        parentIds: ["person1", "person2"],
        spouseIds: ["person9"],
        childrenIds: ["person10"],
      },
      {
        id: "person5",
        name: "Michael Smith",
        birthDate: "1980-07-03",
        imageUrl: "/placeholder.svg?key=ggwai",
        bio: "Architect, single",
        parentIds: ["person1", "person2"],
      },
      {
        id: "person6",
        name: "Sarah Smith",
        birthDate: "1976-09-17",
        imageUrl: "/woman-with-glasses.png",
        bio: "Marketing executive",
        spouseIds: ["person3"],
        childrenIds: ["person7", "person8"],
      },
      {
        id: "person7",
        name: "Emily Smith",
        birthDate: "2005-04-30",
        imageUrl: "/placeholder.svg?key=q6pks",
        bio: "High school student, plays violin",
        parentIds: ["person3", "person6"],
      },
      {
        id: "person8",
        name: "Daniel Smith",
        birthDate: "2008-12-10",
        imageUrl: "/placeholder.svg?key=73j3l",
        bio: "Middle school student, loves soccer",
        parentIds: ["person3", "person6"],
      },
      {
        id: "person9",
        name: "Thomas Wilson",
        birthDate: "1977-06-25",
        imageUrl: "/placeholder.svg?height=100&width=100&query=middle aged man with beard",
        bio: "Financial analyst",
        spouseIds: ["person4"],
        childrenIds: ["person10"],
      },
      {
        id: "person10",
        name: "Olivia Wilson",
        birthDate: "2010-02-14",
        imageUrl: "/placeholder.svg?height=100&width=100&query=young girl with pigtails",
        bio: "Elementary school student, loves drawing",
        parentIds: ["person4", "person9"],
      },
    ],
  }
  