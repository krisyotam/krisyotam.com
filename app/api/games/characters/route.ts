import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'games', 'characters.json');
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // Create default data if the file doesn't exist
      const defaultData = [
        {
          "id": "1",
          "name": "Kratos",
          "game": "God of War",
          "role": "Protagonist",
          "avatarImage": "/placeholder.svg?height=180&width=180",
          "description": "The Ghost of Sparta"
        },
        {
          "id": "2",
          "name": "Link",
          "game": "The Legend of Zelda",
          "role": "Protagonist",
          "avatarImage": "/placeholder.svg?height=180&width=180",
          "description": "Hero of Time"
        },
        {
          "id": "3",
          "name": "Aloy",
          "game": "Horizon Zero Dawn",
          "role": "Protagonist",
          "avatarImage": "/placeholder.svg?height=180&width=180",
          "description": "Seeker and Machine Hunter"
        },
        {
          "id": "4",
          "name": "Arthur Morgan",
          "game": "Red Dead Redemption 2",
          "role": "Protagonist",
          "avatarImage": "/placeholder.svg?height=180&width=180",
          "description": "Outlaw in the Van der Linde gang"
        },
        {
          "id": "5",
          "name": "Geralt of Rivia",
          "game": "The Witcher 3",
          "role": "Protagonist",
          "avatarImage": "/placeholder.svg?height=180&width=180",
          "description": "The White Wolf"
        }
      ];
      
      // Create the file with default data
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return NextResponse.json(defaultData);
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading characters data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters data' }, 
      { status: 500 }
    );
  }
}
