"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, AlertCircle, Shield, XCircle } from 'lucide-react'

interface Rule {
  rule: string
}

interface ContactInfoProps {
  notice: {
    message: string
  }
  rules: Rule[]
  blacklistNotes: {
    message: string
  }
}

export default function ContactInfo({ notice, rules, blacklistNotes }: ContactInfoProps) {
  const [expandedRules, setExpandedRules] = useState<boolean>(false)

  const toggleRules = () => {
    setExpandedRules(!expandedRules)
  }

  return (
    <div className="!flex !flex-col !gap-4 !mb-4 !w-full">
      {/* Notice Bento */}
      <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800">
        <div className="!flex !items-start !gap-3">
          <AlertCircle className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
          <div>
            <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300 !mb-1">Notice</h3>
            <p className="!text-sm !text-foreground dark:!text-zinc-300">{notice.message}</p>
          </div>
        </div>
      </Card>

      {/* Rules Bento */}
      <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800">
        <button className="!w-full !flex !items-start !gap-3 !text-left !focus:outline-none" onClick={toggleRules}>
          <Shield className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
          <div className="!flex-1">
            <div className="!flex !justify-between !items-center">
              <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300">Rules</h3>
              {expandedRules ? (
                <ChevronUp className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
              ) : (
                <ChevronDown className="!h-4 !w-4 !text-muted-foreground dark:!text-zinc-400" />
              )}
            </div>
            {!expandedRules && rules.length > 0 && (
              <p className="!text-sm !text-muted-foreground dark:!text-zinc-400 !mt-1">
                {rules.length} rule{rules.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </button>

        {expandedRules && (
          <div className="!mt-3">
            <div className="!border !border-border dark:!border-zinc-800 !rounded-none !overflow-hidden">
              <table className="!w-full !text-sm">
                <tbody>
                  {rules.map((rule, index) => (
                    <tr
                      key={index}
                      className={`!border-b !border-border dark:!border-zinc-800 ${index === rules.length - 1 ? "!border-b-0" : ""}`}
                    >
                      <td className="!py-2 !px-3 !text-foreground dark:!text-zinc-300">{index + 1}.</td>
                      <td className="!py-2 !pr-3 !text-foreground dark:!text-zinc-300">{rule.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Blacklist Notes Bento */}
      <Card className="!p-4 !bg-card dark:bg-[#1A1A1A] !text-card-foreground dark:!text-zinc-100 !border-border dark:!border-zinc-800">
        <div className="!flex !items-start !gap-3">
          <XCircle className="!h-5 !w-5 !text-muted-foreground dark:!text-zinc-400 !mt-0.5 !flex-shrink-0" />
          <div>
            <h3 className="!text-sm !font-medium !text-foreground dark:!text-zinc-300 !mb-1">Blacklist Notes</h3>
            <p className="!text-sm !text-foreground dark:!text-zinc-300">{blacklistNotes.message}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}