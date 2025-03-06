"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface PasswordDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  researchId: string
  title: string
  status: string
}

interface AccessRequest {
  name: string
  institution: string
  reason: string
  return: string  // Added return field for return address
}

export function PasswordDialog({ isOpen, onClose, onSuccess, researchId, title, status }: PasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [accessRequest, setAccessRequest] = useState<AccessRequest>({
    name: "",
    institution: "",
    reason: "",
    return: "",  // Initialize the return field as empty
  })
  const { toast } = useToast()
  const [failedAttempts, setFailedAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/research/verify-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          researchId,
          password,
        }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        const data = await response.json()
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)
        toast({
          title: newAttempts >= 3 ? "Too many attempts" : "Error",
          description:
            newAttempts >= 3 ? "Please try again later" : data.error || "Invalid password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      const newAttempts = failedAttempts + 1
      setFailedAttempts(newAttempts)
      toast({
        title: newAttempts >= 3 ? "Too many attempts" : "Error",
        description: newAttempts >= 3 ? "Please try again later" : "Try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setPassword("")
    }
  }

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/research/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          researchId,
          title,
          ...accessRequest,  // Spread the accessRequest object, which now includes return
        }),
      })

      if (response.ok) {
        toast({
          description: "Request submitted",
        })
        onClose()
      } else {
        toast({
          description: "Try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send access request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setAccessRequest({ name: "", institution: "", reason: "", return: "" })  // Reset all fields
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{showRequestForm ? "Request Access" : "Enter Password"}</DialogTitle>
        </DialogHeader>
        {!showRequestForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">{title}</h3>
              <Input
                type="password"
                placeholder="Enter 6-digit password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={6}
                pattern="[0-9]{6}"
                required
                className="w-full"
                disabled={failedAttempts >= 3}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={password.length !== 6 || isLoading || failedAttempts >= 3}>
                  {isLoading ? "Verifying..." : "Submit"}
                </Button>
              </div>
              {status === "published" && (
                <Button type="button" variant="link" className="text-sm" onClick={() => setShowRequestForm(true)}>
                  Request Access
                </Button>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handleRequestAccess} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={accessRequest.name}
                onChange={(e) => setAccessRequest({ ...accessRequest, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={accessRequest.institution}
                onChange={(e) => setAccessRequest({ ...accessRequest, institution: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Access</Label>
              <Textarea
                id="reason"
                value={accessRequest.reason}
                onChange={(e) => setAccessRequest({ ...accessRequest, reason: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return">Return Address</Label>
              <Input
                id="return"
                value={accessRequest.return}
                onChange={(e) => setAccessRequest({ ...accessRequest, return: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Submit Request"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}