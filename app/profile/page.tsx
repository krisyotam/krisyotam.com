import Image from "next/image"
import { Cake, User2, GraduationCap, Book, Home, Building2, Languages, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import profileData from "@/data/profile.json"

interface ImageItem {
  src: string
  alt: string
}

interface ProfileItem {
  type: string
  subtype?: string
  hierarchy: number
  src?: string
  alt?: string
  images?: ImageItem[]
  birthday?: string
  gender?: string
  height?: string
  job?: string
  school?: string
  religiousAffiliation?: string
  city?: string
  languages?: string[]
  searchingFor?: string
  question?: string
  answer?: string
  answers?: string[]
}

export default function ProfilePage() {
  const sortedProfileData = profileData.profileData.sort((a: ProfileItem, b: ProfileItem) => a.hierarchy - b.hierarchy)

  const renderProfileItem = (item: ProfileItem) => {
    switch (item.type) {
      case "image":
        return renderImage(item)
      case "bio":
        return renderBio(item)
      case "qAndA":
        return renderQAndA(item)
      default:
        return null
    }
  }

  const renderImage = (item: ProfileItem) => {
    switch (item.subtype) {
      case "image1x1":
        return (
          <div className="aspect-square relative rounded-3xl overflow-hidden">
            <Image src={item.src || "/placeholder.svg"} alt={item.alt || ""} fill className="object-cover" />
          </div>
        )
      case "image2x2":
        return (
          <div className="grid grid-cols-2 gap-2 aspect-square">
            {item.images?.map((image, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        )
      case "image1x2":
        return (
          <div className="grid grid-cols-2 gap-2 aspect-square">
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={item.images?.[0].src || "/placeholder.svg"}
                alt={item.images?.[0].alt || ""}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-2">
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src={item.images?.[1].src || "/placeholder.svg"}
                  alt={item.images?.[1].alt || ""}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src={item.images?.[2].src || "/placeholder.svg"}
                  alt={item.images?.[2].alt || ""}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )
      case "image3x3":
        return (
          <div className="grid grid-cols-3 gap-2 aspect-square">
            {item.images?.map((image, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        )
      case "image3x2":
        return (
          <div className="grid grid-cols-3 grid-rows-2 gap-2 aspect-[3/2]">
            {item.images?.map((image, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const renderBio = (item: ProfileItem) => {
    return (
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Cake className="w-5 h-5" />
            <span>{item.birthday ? new Date().getFullYear() - new Date(item.birthday).getFullYear() : ""}</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <User2 className="w-5 h-5" />
            <span>{item.gender}</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <span>{item.height}</span>
          </div>
        </div>

        <div className="space-y-4 divide-y">
          {[
            { icon: Building2, text: item.job },
            { icon: GraduationCap, text: item.school },
            { icon: Book, text: item.religiousAffiliation },
            { icon: Home, text: item.city },
            { icon: Languages, text: item.languages?.join(", ") },
            { icon: Search, text: item.searchingFor },
          ].map((row, index) => (
            <div key={index} className="flex items-center py-3">
              <div className="w-8 flex-shrink-0">
                <row.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="flex-grow">{row.text}</span>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  const renderQAndA = (item: ProfileItem) => {
    return (
      <Card className="p-4">
        <h3 className="font-medium mb-2">{item.question}</h3>
        {item.answer && <p className="text-gray-600">{item.answer}</p>}
        {item.answers && (
          <div className="space-y-3 mt-2">
            {item.answers.map((answer, index) => (
              <p key={index} className="text-gray-600">
                {answer}
              </p>
            ))}
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pt-20">
      <div className="space-y-6">
        {sortedProfileData.map((item, index) => (
          <div key={index}>{renderProfileItem(item as ProfileItem)}</div>
        ))}
      </div>
    </div>
  )
}

