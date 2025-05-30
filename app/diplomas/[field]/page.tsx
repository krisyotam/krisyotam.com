import { notFound } from "next/navigation"

interface DiplomasFieldPageProps {
  params: {
    field: string
  }
}

export default function DiplomasFieldPage({ params }: DiplomasFieldPageProps) {
  // For now, redirect to not found until diplomas are implemented
  notFound()
}