import { Metadata } from 'next';
import { PageHeader } from "@/components/page-header";
import { LegalDocumentsClient } from './legal-client';
import { staticMetadata } from "@/lib/staticMetadata";

// Import legal data
import legalData from './legal.json';

export const metadata: Metadata = staticMetadata.legal;

export default function LegalPage() {  return (
    <main className="max-w-[600px] mx-auto px-4 py-12">
      <PageHeader 
        title="Legal"
        subtitle="Policies & Terms"
        date={new Date().toISOString()}
        preview="Essential legal documents and policies"
        status="Finished"
        confidence="certain"
        importance={8}
      />
      
      <LegalDocumentsClient />
    </main>
  );
}
