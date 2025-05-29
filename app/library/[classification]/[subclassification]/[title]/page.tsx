export default async function Page({ params }: { params: { title: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/library/book/${params.title}`, {
    cache: 'force-cache'
  })
  
  if (!response.ok) {
    return <p>Book not found</p>
  }

  const book = await response.json()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <div className="mb-6">
        <img src={book.coverUrl} alt={book.title} className="w-48 h-auto mb-4" />
        <p><strong>Classification:</strong> {book.classification} - {book.subClassification}</p>
        <p><strong>Publisher:</strong> {book.publisher}</p>
        <p><strong>Year:</strong> {book.yearPublished}</p>
        {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
        {book.series && <p><strong>Series:</strong> {book.series}</p>}
      </div>      {book.authors && book.authors.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">About the Author(s)</h2>
          {book.authors.map((author: any) => (
            <div key={author.slug} className="mb-6 p-4 border rounded-lg shadow-sm">
              <h3 className="text-xl font-medium">{author.name}</h3>
              {author.fullName && author.fullName !== author.name && (
                <p className="text-sm text-gray-600 mb-2"><strong>Full Name:</strong> {author.fullName}</p>
              )}
              {author.degrees && author.degrees.length > 0 && (
                <p className="text-sm text-gray-600 mb-2"><strong>Education:</strong> {author.degrees.join(", ")}</p>
              )}
              {author.currentAffiliation && (
                <p className="text-sm text-gray-600 mb-2"><strong>Current Affiliation:</strong> {author.currentAffiliation}</p>
              )}
              {author.previousAffiliations && author.previousAffiliations.length > 0 && (
                <p className="text-sm text-gray-600 mb-2"><strong>Previous Affiliations:</strong> {author.previousAffiliations.join(", ")}</p>
              )}
              {author.fieldOfExpertise && author.fieldOfExpertise.length > 0 && (
                <p className="text-sm text-gray-600 mb-2"><strong>Fields of Expertise:</strong> {author.fieldOfExpertise.join(", ")}</p>
              )}
              {author.notableAchievements && author.notableAchievements.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Notable Achievements:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {author.notableAchievements.map((achievement: string, index: number) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              {author.bio && (
                <p className="text-sm text-gray-700 mt-3">{author.bio}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export async function generateStaticParams() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/library-catalog`, {
    cache: 'force-cache'
  })
  const books = await response.json()
  
  return books.map((book: any) => ({
    title: book.slug || book.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }))
}