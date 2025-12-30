"use client"

import { useState } from "react"
import ProfileBento from "@/components/profile-bento"
import aboutProfileData from "@/data/about/about-profile.json"
import aboutPredictionsData from "@/data/about/about-predictions.json"

export default function Profile() {
  return (
    <div className="py-4">
      <ProfileBento data={aboutProfileData} predictions={aboutPredictionsData.predictions} />
    </div>
  )
} 