"use client"

import { useEffect, useState } from "react"
import { CompanyCard } from "./company-card"

interface RevenuePoint {
  month: string
  value: number
}

interface Company {
  id: string
  name: string
  description: string
  logo: string
  stripeAccountId: string
  color: string
  useDemo?: boolean
  monthlyRevenue?: number
  demoData: {
    monthlyRevenue: number
    revenueHistory: RevenuePoint[]
    minValue: number
    maxValue: number
  }
}

export function CompaniesGrid() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/companies")
        if (!response.ok) {
          throw new Error("Failed to fetch companies")
        }
        const data = await response.json()
        setCompanies(data)
      } catch (err) {
        console.error("Error fetching companies:", err)
        setError("Failed to load companies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-[160px] bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-3 px-3 py-1.5 bg-primary text-white rounded-md text-sm"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {companies.map((company) => {
        // Use demo data if Stripe data is not available
        const useDemo = company.useDemo !== false
        const monthlyRevenue = useDemo ? company.demoData.monthlyRevenue : company.monthlyRevenue || 0

        return (
          <CompanyCard
            key={company.id}
            name={company.name}
            description={company.description}
            logo={company.logo}
            monthlyRevenue={monthlyRevenue}
            revenueHistory={company.demoData.revenueHistory}
            minValue={company.demoData.minValue}
            maxValue={company.demoData.maxValue}
          />
        )
      })}
    </div>
  )
}

