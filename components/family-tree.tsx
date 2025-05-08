"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, Heart, Users, Maximize2, X, ChevronDown, ChevronUp, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Types for family tree data
interface FamilyMember {
  id: string
  name: string
  birthDate?: string
  deathDate?: string
  imageUrl?: string
  bio?: string
  parentIds?: string[]
  spouseIds?: string[]
  childrenIds?: string[]
}

interface FamilyTree {
  members: FamilyMember[]
  rootMemberId: string
}

interface TreeNode {
  member: FamilyMember
  children: TreeNode[]
  spouses: FamilyMember[]
  parents: FamilyMember[]
  level: number
}

interface TreeProps {
  family: string
}

// Utility functions
function buildFamilyTree(data: FamilyTree, startId: string = data.rootMemberId, level = 0): TreeNode | null {
  const member = data.members.find((m) => m.id === startId)
  if (!member) return null

  const node: TreeNode = {
    member,
    children: [],
    spouses: [],
    parents: [],
    level,
  }

  // Add spouses
  if (member.spouseIds) {
    node.spouses = member.spouseIds
      .map((id) => data.members.find((m) => m.id === id))
      .filter((spouse): spouse is FamilyMember => spouse !== undefined)
  }

  // Add parents
  if (member.parentIds) {
    node.parents = member.parentIds
      .map((id) => data.members.find((m) => m.id === id))
      .filter((parent): parent is FamilyMember => parent !== undefined)
  }

  // Add children
  if (member.childrenIds) {
    node.children = member.childrenIds
      .map((id) => buildFamilyTree(data, id, level + 1))
      .filter((child): child is TreeNode => child !== null)
  }

  return node
}

function formatDate(dateString?: string): string {
  if (!dateString) return "Unknown"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function calculateAge(birthDate?: string, deathDate?: string): string {
  if (!birthDate) return "Unknown"

  const birth = new Date(birthDate)
  const end = deathDate ? new Date(deathDate) : new Date()

  let age = end.getFullYear() - birth.getFullYear()
  const monthDiff = end.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--
  }

  return age.toString()
}

// Family Member Detail Component
function FamilyMemberDetail({ 
  member, 
  relatives, 
  onSelectMember 
}: { 
  member: FamilyMember, 
  relatives: { parents: FamilyMember[], spouses: FamilyMember[], children: FamilyMember[] }, 
  onSelectMember: (id: string) => void 
}) {
  const { parents, spouses, children } = relatives

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">{member.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-border">
              <Image
                src={member.imageUrl || "/placeholder.svg?height=200&width=200&query=person silhouette"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-grow">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Born: {formatDate(member.birthDate)}</p>
                  {member.deathDate && <p className="text-sm font-medium">Died: {formatDate(member.deathDate)}</p>}
                  <p className="text-sm text-muted-foreground">
                    Age: {calculateAge(member.birthDate, member.deathDate)}
                  </p>
                </div>
              </div>

              {member.bio && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Biography</h3>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              )}

              {parents.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Parents</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parents.map((parent) => (
                      <button
                        key={parent.id}
                        onClick={() => onSelectMember(parent.id)}
                        className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                      >
                        {parent.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {spouses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Spouse{spouses.length > 1 ? "s" : ""}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {spouses.map((spouse) => (
                      <button
                        key={spouse.id}
                        onClick={() => onSelectMember(spouse.id)}
                        className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                      >
                        {spouse.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {children.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Children</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => onSelectMember(child.id)}
                        className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Family Tree Node Component
function FamilyTreeNode({ 
  node, 
  onSelectMember, 
  expanded = false, 
  isModal = false 
}: { 
  node: TreeNode, 
  onSelectMember: (id: string) => void, 
  expanded?: boolean, 
  isModal?: boolean 
}) {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const { member, children, spouses } = node

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const cardSizeClass = isModal 
    ? "w-64 min-h-[180px]" 
    : "w-40 min-h-[60px] max-w-full"

  // Compact view for non-modal cards
  if (!isModal) {
    return (
      <div className="flex flex-col items-center">
        <Card className={`${cardSizeClass} relative hover:shadow-md transition-shadow duration-200`}>
          <CardContent className="p-1 flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0">
              <Image
                src={member.imageUrl || "/placeholder.svg?height=100&width=100&query=person silhouette"}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-xs truncate">{member.name}</h3>
              <div className="flex items-center text-[10px] text-muted-foreground">
                <span className="truncate">
                  {member.birthDate ? formatDate(member.birthDate).split(' ')[2] : ""} 
                  {member.deathDate ? ` - ${formatDate(member.deathDate).split(' ')[2]}` : ""}
                </span>
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-auto" onClick={(e) => {e.stopPropagation(); onSelectMember(member.id)}}>
                  <Info className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {children.length > 0 && (
          <Button variant="ghost" size="sm" className="mt-0.5 h-4 px-1 text-[10px]" onClick={toggleExpand}>
            {isExpanded ? <ChevronUp className="h-3 w-3 mr-0.5" /> : <ChevronDown className="h-3 w-3 mr-0.5" />}
            {children.length}
          </Button>
        )}

        {isExpanded && children.length > 0 && (
          <div className="mt-1 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-1 w-0.5 bg-border"></div>
            <div className="flex flex-wrap justify-center gap-2 pt-1 max-w-full">
              {children.map((child) => (
                <div key={child.member.id} className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 h-1 w-0.5 bg-border"></div>
                  <FamilyTreeNode node={child} onSelectMember={onSelectMember} expanded={false} isModal={isModal} />
                </div>
              ))}
            </div>
          </div>
        )}

        {spouses.length > 0 && (
          <div className="mt-0.5 flex gap-1 flex-wrap justify-center">
            {spouses.map((spouse) => (
              <Button
                key={spouse.id}
                variant="outline"
                size="sm"
                className="h-4 text-[10px] px-1"
                onClick={() => onSelectMember(spouse.id)}
              >
                {spouse.name.split(' ').pop()}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full view for modal
  return (
    <div className="flex flex-col items-center">
      <Card className={`${cardSizeClass} relative hover:shadow-md transition-shadow duration-200`}>
        <CardContent className="p-3 flex flex-col items-center">
          <div className="absolute top-1 right-1">
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onSelectMember(member.id)}>
              <Info className="h-3 w-3" />
              <span className="sr-only">View details</span>
            </Button>
          </div>

          <div className="relative w-12 h-12 rounded-full overflow-hidden mb-1 border-2 border-border">
            <Image
              src={member.imageUrl || "/placeholder.svg?height=100&width=100&query=person silhouette"}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>

          <h3 className="font-medium text-center text-xs">{member.name}</h3>
          <p className="text-xs text-muted-foreground text-center">
            {member.birthDate ? formatDate(member.birthDate).split(' ')[2] : ""} 
            {member.deathDate ? ` - ${formatDate(member.deathDate).split(' ')[2]}` : ""}
          </p>
        </CardContent>
      </Card>

      {children.length > 0 && (
        <Button variant="ghost" size="sm" className="mt-1 h-6 px-2" onClick={toggleExpand}>
          {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
          {isExpanded ? "Collapse" : `Show ${children.length} ${children.length === 1 ? "child" : "children"}`}
        </Button>
      )}

      {isExpanded && children.length > 0 && (
        <div className="mt-4 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-4 w-0.5 bg-border"></div>
          <div className="flex flex-wrap justify-center gap-4 pt-4 max-w-full">
            {children.map((child) => (
              <div key={child.member.id} className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-4 h-4 w-0.5 bg-border"></div>
                <FamilyTreeNode node={child} onSelectMember={onSelectMember} expanded={false} isModal={isModal} />
              </div>
            ))}
          </div>
        </div>
      )}

      {spouses.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-center text-muted-foreground">Spouse{spouses.length > 1 ? "s" : ""}:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {spouses.map((spouse) => (
              <Button
                key={spouse.id}
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onSelectMember(spouse.id)}
              >
                {spouse.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main Tree Component
export function Tree({ family }: TreeProps) {
  const [familyTree, setFamilyTree] = useState<FamilyTree | null>(null)
  const [familyInfo, setFamilyInfo] = useState<{ name: string, description: string } | null>(null)
  const [rootNode, setRootNode] = useState<TreeNode | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Add panning state
  const [isPanning, setIsPanning] = useState(false)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 })

  // Handle modal opening with fixed centering
  useEffect(() => {
    if (isModalOpen) {
      // Center the view by resetting pan position
      setPanPosition({ x: 0, y: 0 })
    }
  }, [isModalOpen])

  // Update cursor styles based on whether user is actively panning
  const [grabbing, setGrabbing] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isModalOpen) {
      setGrabbing(true)
      setIsPanning(true)
      setStartPanPosition({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && isModalOpen) {
      const newX = e.clientX - startPanPosition.x
      const newY = e.clientY - startPanPosition.y
      setPanPosition({
        x: newX,
        y: newY
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
    setGrabbing(false)
  }

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        setLoading(true)
        
        // First fetch the index to get info about this family
        const indexResponse = await fetch('/api/family-trees')
        
        if (!indexResponse.ok) {
          throw new Error('Failed to load family tree index')
        }
        
        const indexData = await indexResponse.json()
        const familyEntry = indexData.find((entry: any) => entry.slug === family)
        
        if (!familyEntry) {
          throw new Error(`Family "${family}" not found in index`)
        }
        
        setFamilyInfo({
          name: familyEntry.name,
          description: familyEntry.description
        })
        
        // Now fetch the specific family data
        const dataResponse = await fetch(`/api/family-trees/${family}`)
        
        if (!dataResponse.ok) {
          throw new Error(`Failed to load data for family "${family}"`)
        }
        
        const treeData = await dataResponse.json()
        setFamilyTree(treeData)
        
        // Build the tree structure
        const tree = buildFamilyTree(treeData, treeData.rootMemberId)
        setRootNode(tree)
        setError(null)
      } catch (err) {
        console.error('Error loading family tree:', err)
        setError(err instanceof Error ? err.message : 'Failed to load family tree')
      } finally {
        setLoading(false)
      }
    }
    
    fetchFamilyData()
  }, [family])

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId)
    setIsDetailOpen(true)
  }

  const getSelectedMember = (): FamilyMember | undefined => {
    return familyTree?.members.find((m) => m.id === selectedMemberId)
  }

  const getRelatives = (memberId: string) => {
    if (!familyTree) return { parents: [], spouses: [], children: [] }
    
    const member = familyTree.members.find((m) => m.id === memberId)
    if (!member) return { parents: [], spouses: [], children: [] }

    const parents = member.parentIds
      ? member.parentIds.map((id) => familyTree.members.find((m) => m.id === id)).filter((m): m is FamilyMember => !!m)
      : []

    const spouses = member.spouseIds
      ? member.spouseIds.map((id) => familyTree.members.find((m) => m.id === id)).filter((m): m is FamilyMember => !!m)
      : []

    const children = member.childrenIds
      ? member.childrenIds.map((id) => familyTree.members.find((m) => m.id === id)).filter((m): m is FamilyMember => !!m)
      : []

    return { parents, spouses, children }
  }

  if (loading) {
    return <div className="text-center py-8">Loading family tree...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (!rootNode || !familyInfo) {
    return <div className="text-center py-8">No family tree data available.</div>
  }

  const selectedMember = getSelectedMember()
  const relatives = selectedMember ? getRelatives(selectedMember.id) : { parents: [], spouses: [], children: [] }

  return (
    <div className="family-tree-container my-2">
      <div className="w-full">
        <div className="family-tree-preview p-2 border rounded-lg bg-card">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-base font-medium">{familyInfo?.name}</h2>
              <p className="text-xs text-muted-foreground">{familyInfo?.description}</p>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setIsModalOpen(true)}>
              <Maximize2 className="h-3 w-3 mr-1" />
              Expand
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="max-w-full overflow-visible">
              {rootNode && (
                <FamilyTreeNode 
                  node={rootNode} 
                  onSelectMember={handleSelectMember} 
                  expanded={false} 
                />
              )}
            </div>
          </div>
          <div className="text-center mt-1 text-xs text-muted-foreground">
            <p>Click Expand for full tree</p>
          </div>
        </div>

        {/* Member Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Family Member Details</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <FamilyMemberDetail member={selectedMember} relatives={relatives} onSelectMember={handleSelectMember} />
            )}
          </DialogContent>
        </Dialog>

        {/* Full Tree Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-3 border-b">
                <DialogTitle className="text-xl">{familyInfo.name}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPanPosition({ x: 0, y: 0 })}>
                    Center View
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div 
                className={`flex-grow overflow-hidden p-6 ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div 
                  className="min-w-max inline-block"
                  style={{ 
                    transform: `translate(${panPosition.x}px, ${panPosition.y}px)`,
                    transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                  }}
                >
                  <FamilyTreeNode
                    node={rootNode}
                    onSelectMember={handleSelectMember}
                    expanded={true}
                    isModal={true}
                  />
                </div>
              </div>
              <div className="p-2 text-xs text-center text-muted-foreground border-t">
                Click and drag to pan around the family tree
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 