"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const reasonSchema = z.object({
  reason: z.enum(["collaborate", "ask-question", "research-idea", "advice", "friend-request"]),
})

const collaborateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  cvUpload: z.any().optional(),
  projectDetails: z.string().min(10, "Please provide some details about your project"),
  timeline: z.string().min(1, "Please provide a timeline"),
  budget: z.string().min(1, "Please provide budget information"),
})

const askQuestionSchema = z.object({
  question: z.string().min(10, "Please provide your question."),
  priorResearch: z.string().min(20, "Please describe where you have looked for answers."),
  contactInfo: z.string().email("Please provide a valid email address."),
  additionalContext: z.string().optional(),
  motivation: z.string().optional(),
})

const researchIdeaSchema = z.object({
  ideaTitle: z.string().min(3, "Please provide a title for your research idea."),
  detailedDescription: z.string().min(50, "Please provide a detailed description of your research idea."),
  rationale: z.string().min(20, "Please explain why this research idea is important."),
  contactInfo: z.string().email("Please provide a valid email address."),
  supportingResources: z.string().url().optional(),
  previousWork: z.string().optional(),
  additionalComments: z.string().optional(),
})

const adviceSchema = z.object({
  situation: z.string().min(50, "Please provide a detailed description of your situation."),
  adviceSought: z.string().min(20, "Please specify what advice you're seeking."),
  contactInfo: z.string().email("Please provide a valid email address."),
  currentFeelings: z.string().optional(),
  triedSolutions: z.string().optional(),
  underlyingConcerns: z.string().optional(),
  backgroundInfo: z.string().optional(),
  personalReflections: z.string().optional(),
})

const friendRequestSchema = z.object({
  introduction: z.string().min(20, "Please provide a brief introduction."),
  interests: z.string().min(50, "Please list your interests in detail."),
  discordHandle: z.string().min(3, "Please provide your Discord handle."),
  email: z.string().email("Please provide a valid email address."),
  age: z.number().min(13, "You must be at least 13 years old.").max(120, "Please enter a valid age."),
  personalityType: z.string().optional(),
  enneagramType: z.string().optional(),
  additionalDetails: z.string().optional(),
  additionalComments: z.string().optional(),
})

const formSchema = z.discriminatedUnion("reason", [
  z.object({ 
    reason: z.literal("collaborate"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    cvUpload: z.any().optional(),
    projectDetails: z.string().min(10, "Please provide some details about your project"),
    timeline: z.string().min(1, "Please provide a timeline"),
    budget: z.string().min(1, "Please provide budget information"),
  }),
  z.object({ reason: z.literal("ask-question"), ...askQuestionSchema.shape }),
  z.object({ reason: z.literal("research-idea"), ...researchIdeaSchema.shape }),
  z.object({ reason: z.literal("advice"), ...adviceSchema.shape }),
  z.object({ reason: z.literal("friend-request"), ...friendRequestSchema.shape }),
])

export function ContactForm() {
  const [step, setStep] = useState(0)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "collaborate",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      toast({
        title: "Form submitted",
        description: "Thank you for your submission. We'll get back to you soon!",
      })
      form.reset()
      setStep(0)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderFormFields = () => {
    const reason = form.watch("reason")

    switch (reason) {
      case "collaborate":
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter your message" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cvUpload"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>CV Upload (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Details</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter project details" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Timeline</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter project timeline" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Budget</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter project budget" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case "ask-question":
        return (
          <>
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="What is the question you want answered?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priorResearch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prior Research</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe where you have looked for answers..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Context (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any extra background information..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivation (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="What prompted you to ask this question now?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case "research-idea":
        return (
          <>
            <FormField
              control={form.control}
              name="ideaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Idea Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the title of your research idea" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detailedDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Explain your research idea in depth..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rationale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rationale/Importance</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Explain why this research idea is important..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportingResources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supporting Resources/Links (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/resource" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Work/Experience (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe any related research or projects..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any extra information you wish to include..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case "advice":
        return (
          <>
            <FormField
              control={form.control}
              name="situation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Situation</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Provide a detailed account of your current situation..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adviceSought"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Advice Sought</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="What specific advice or guidance are you looking for?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentFeelings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Feelings (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="How are you feeling about this situation?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="triedSolutions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What You've Tried (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe any steps or solutions you have already attempted..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="underlyingConcerns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Underlying Concerns (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="What might be the deeper issue behind this situation?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any additional context or history..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalReflections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Reflections (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Reflect on any recurring patterns or influences..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case "friend-request":
        return (
          <>
            <FormField
              control={form.control}
              name="introduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Introduction</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write a short description explaining why you're reaching out..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exhaustive List of Interests</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="List your interests in detail..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discordHandle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord Handle</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your Discord handle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Enter your age" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personality Type (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., INTJ, ENFP" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enneagramType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enneagram Type (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Type 4, Type 7" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Personality/Interests Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any extra details about your personality or hobbies..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any other information you'd like to share..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 0 && (
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why are you filling this out?</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setStep(1)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="collaborate">Collaborate</SelectItem>
                    <SelectItem value="ask-question">Ask a Question</SelectItem>
                    <SelectItem value="research-idea">Give a Research Idea</SelectItem>
                    <SelectItem value="advice">Ask for Advice</SelectItem>
                    <SelectItem value="friend-request">Friend Request</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {step === 1 && renderFormFields()}
        {step === 1 && <Button type="submit">Submit</Button>}
      </form>
    </Form>
  )
}

