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
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="Essential legal documents and policies"
        status="Finished"
        confidence="certain"
        importance={8}
      />
      
      <LegalDocumentsClient />
    </main>
  );
}
