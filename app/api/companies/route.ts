import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" })
  : null

export async function GET() {
  try {
    // Read the companies data from the JSON file
    const filePath = path.join(process.cwd(), "data", "indie-companies.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    const companiesData = JSON.parse(fileData)

    // If Stripe is not configured, return demo data
    if (!stripe) {
      return NextResponse.json(companiesData.companies)
    }

    // Fetch revenue data from Stripe for each company
    const companiesWithRevenue = await Promise.all(
      companiesData.companies.map(async (company) => {
        try {
          if (!company.stripeAccountId) {
            return { ...company, useDemo: true }
          }

          // Try to fetch data from Stripe
          const now = new Date()
          const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1))

          // Get monthly revenue
          const balance = await stripe.balance.retrieve({
            stripeAccount: company.stripeAccountId,
          })

          const availableBalance = balance.available.reduce((sum, balance) => sum + balance.amount, 0)

          // Get revenue history (simplified - in a real app you'd use reports API)
          // This is a placeholder - actual implementation would be more complex
          const monthlyRevenue = availableBalance / 100 // Convert cents to dollars

          return {
            ...company,
            monthlyRevenue,
            useDemo: false,
          }
        } catch (error) {
          console.error(`Error fetching Stripe data for ${company.name}:`, error)
          return { ...company, useDemo: true }
        }
      }),
    )

    return NextResponse.json(companiesWithRevenue)
  } catch (error) {
    console.error("Error fetching companies data:", error)
    return NextResponse.json({ error: "Failed to fetch companies data" }, { status: 500 })
  }
}

