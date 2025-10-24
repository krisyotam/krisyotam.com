import { promises as fs } from 'fs'
import { join } from 'path'

export async function updateMalTokensInEnv(accessToken: string, refreshToken: string) {
  try {
    const envPath = join(process.cwd(), '.env.local')
    
    // Read the current .env.local file
    const envContent = await fs.readFile(envPath, 'utf8')
    
    // Update the MAL tokens
    let updatedContent = envContent.replace(
      /MAL_ACCESS_TOKEN=.*/,
      `MAL_ACCESS_TOKEN=${accessToken}`
    )
    
    updatedContent = updatedContent.replace(
      /MAL_REFRESH_TOKEN=.*/,
      `MAL_REFRESH_TOKEN=${refreshToken}`
    )
    
    // Write the updated content back to the file
    await fs.writeFile(envPath, updatedContent, 'utf8')
    
    console.log('✅ MAL tokens updated in .env.local file')
    return true
  } catch (error) {
    console.error('❌ Error updating MAL tokens in .env.local:', error)
    return false
  }
}
