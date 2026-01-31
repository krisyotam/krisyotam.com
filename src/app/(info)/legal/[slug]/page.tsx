import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { format } from 'date-fns';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/core';
import { PDFViewer } from '../components/pdf-viewer';
import { Citation } from '@/components/core/citation';
import { Footer } from '@/components/core/footer';

// Import legal data
import legalData from '../legal.json';

interface LegalDocPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: LegalDocPageProps): Promise<Metadata> {
  const params = await props.params;
  const document = legalData.documents.find(doc => doc.slug === params.slug);

  if (!document) {
    return {
      title: 'Document Not Found | Kris Yotam',
    };
  }

  return {
    title: `${document.name} | Kris Yotam`,
    description: `${document.name} - Legal document for Kris Yotam's website`,
  };
}

export async function generateStaticParams() {
  return legalData.documents
    .filter(doc => doc.status === 'active')
    .map((doc) => ({
      slug: doc.slug,
    }));
}

export default async function LegalDocPage(props: LegalDocPageProps) {
  const params = await props.params;
  const { slug } = params;
  const document = legalData.documents.find(doc => doc.slug === params.slug);

  // Check if document exists and is active
  if (!document || document.status !== 'active') {
    notFound();
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };return (
      <main className="max-w-[600px] mx-auto px-4 py-12">
        <PageHeader 
          title={document.name}
          subtitle="Legal"
          start_date={document.lastUpdated}
          end_date={document.lastUpdated}
          backHref="/legal"
          backText="Legal"
          preview={`Last updated on ${formatDate(document.lastUpdated)}`}
          status="Finished"
          confidence="certain"
          importance={8}      />      <PDFViewer
          pdfUrl={`/legal/documents/${slug}.pdf`} 
          className="mt-6 w-full"
        />      <div className="mt-8">
          <Citation 
            title={document.name}
            slug={document.slug}
            date={document.lastUpdated}
            url={`https://krisyotam.com/legal/${document.slug}`}
          />
        </div>
        
        <Footer />
      </main>
    );
}
