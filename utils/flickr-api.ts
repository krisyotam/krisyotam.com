type FlickrPhoto = {
  id: string
  url: string
  title: string
}

export async function getPhotoUrl(photoId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${process.env.FLICKR_KEY}&photo_id=${photoId}&format=json&nojsoncallback=1`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch photo sizes")
    }

    const data = await response.json()

    if (data.stat !== "ok") {
      throw new Error(data.message || "Failed to fetch photo sizes")
    }

    // Get the largest size available
    const sizes = data.sizes.size
    const largeSize = sizes[sizes.length - 1]

    return largeSize.source
  } catch (error) {
    console.error("Error fetching photo URL:", error)
    return ""
  }
}

export async function getPhotoInfo(photoId: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${process.env.FLICKR_KEY}&photo_id=${photoId}&format=json&nojsoncallback=1`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch photo info")
    }

    const data = await response.json()

    if (data.stat !== "ok") {
      throw new Error(data.message || "Failed to fetch photo info")
    }

    return data.photo
  } catch (error) {
    console.error("Error fetching photo info:", error)
    return null
  }
}

