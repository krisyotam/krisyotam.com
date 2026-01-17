"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
}

const CustomSelect = React.forwardRef<HTMLButtonElement, CustomSelectProps>(
  ({ options, value, onValueChange, placeholder = "Select option...", className, id, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [focusedIndex, setFocusedIndex] = React.useState(-1)
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const listRef = React.useRef<HTMLUListElement>(null)

    const selectedOption = options.find(option => option.value === value)    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node
        if (buttonRef.current && !buttonRef.current.contains(target) && 
            listRef.current && !listRef.current.contains(target)) {
          setIsOpen(false)
          setFocusedIndex(-1)
        }
      }
      
      if (isOpen) {
        // Add a small delay to prevent immediate closing when opening
        const timer = setTimeout(() => {
          document.addEventListener("mousedown", handleClickOutside)
        }, 0)
        
        return () => {
          clearTimeout(timer)
          document.removeEventListener("mousedown", handleClickOutside)
        }
      }
    }, [isOpen])

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault()
          if (isOpen && focusedIndex >= 0) {
            onValueChange(options[focusedIndex].value)
            setIsOpen(false)
            setFocusedIndex(-1)
          } else {
            setIsOpen(!isOpen)
          }
          break
        case "Escape":
          setIsOpen(false)
          setFocusedIndex(-1)
          break
        case "ArrowDown":
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            setFocusedIndex(prev => 
              prev < options.length - 1 ? prev + 1 : 0
            )
          }
          break
        case "ArrowUp":
          event.preventDefault()
          if (isOpen) {
            setFocusedIndex(prev => 
              prev > 0 ? prev - 1 : options.length - 1
            )
          }
          break
      }
    }

    const handleOptionClick = (option: SelectOption) => {
      onValueChange(option.value)
      setIsOpen(false)
      setFocusedIndex(-1)
      buttonRef.current?.focus()
    }

    return (
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          id={id}
          className={cn(
            // Base styles with square corners
            "flex h-9 w-full items-center justify-between border border-input bg-background px-3 py-2 text-sm",
            // Remove all border radius - square corners only
            "rounded-none",            // Focus and hover states matching verse table hover
            "hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Text styles
            "placeholder:text-muted-foreground",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={id ? `${id}-label` : undefined}
          {...props}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </button>        {isOpen && (
          <div className="absolute z-[100] mt-1 w-full">
            <ul
              ref={listRef}
              className={cn(
                // Base dropdown styles with square corners
                "max-h-60 w-full overflow-auto border border-input bg-background py-1 text-sm shadow-md",
                // Square corners - no border radius
                "rounded-none",
                // Ensure it appears above other content
                "focus:outline-none"
              )}
              role="listbox"
              aria-labelledby={id ? `${id}-label` : undefined}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  className={cn(
                    // Base option styles
                    "relative cursor-pointer select-none py-2 px-3",
                    // Hover and focus states matching verse table
                    "hover:bg-secondary/50 transition-colors",
                    // Selected state
                    option.value === value && "bg-secondary/30",
                    // Focused state (keyboard navigation)
                    index === focusedIndex && "bg-secondary/50"
                  )}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <div className="flex items-center justify-between">
                    <span className="block truncate">{option.label}</span>
                    {option.value === value && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)

CustomSelect.displayName = "CustomSelect"

export { CustomSelect }
