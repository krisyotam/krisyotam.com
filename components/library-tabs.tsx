"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CatalogContent } from "./catalog-content"
import { OwnedCollectionsContent } from "./owned-collections-content"
import { LibraryNotesContent } from "./library-notes-content"

export function LibraryTabs() {
  const [activeTab, setActiveTab] = useState("catalog")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="catalog">Catalog</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="catalog">
        <CatalogContent />
      </TabsContent>
      <TabsContent value="collections">
        <OwnedCollectionsContent />
      </TabsContent>
      <TabsContent value="notes">
        <LibraryNotesContent />
      </TabsContent>
    </Tabs>
  )
}

