"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"

const feedbackSchema = z.object({
  feedback: z.string().min(10, "Please provide detailed feedback."),
})

export default function AnonymousFeedbackForm() {
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: "",
    },
  })

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    try {
      const response = await fetch("/api/anonymous-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error("Failed to submit feedback")
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      })
      setSubmitted(true)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Thank you!</h2>
        <p>Your feedback has been received.</p>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">Submit another</Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Feedback? <span className="text-red-500">*</span>
                <div className="text-xs text-muted-foreground mt-2">
                  (NOTE: your feedback is anonymous, unless you want to include your name or contact information. If you do not include contact info, I cannot reply.<br />
                  <br />
                  If this is about a technical website problem, please include browser/OS/device/screenshots &amp; especially include email contact information—just saying "font rendering is horrible" is useless!)
                </div>
              </FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Share your thoughts, suggestions, or concerns..." className="rounded-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Submit Feedback</Button>
        </div>
      </form>
    </Form>
  )
}
