"use client"

import { useState, useEffect } from "react"
import { Box } from "@/components/posts/typography/box"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import format from "date-fns/format"

// Helper function to determine Western Zodiac sign
const getWesternZodiac = (month: number, day: number) => {
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
    return {
      sign: "Capricorn",
      dates: "Dec 22 - Jan 19",
      description: "Capricorns are known for being ambitious, disciplined, and practical.",
    }
  } else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
    return {
      sign: "Aquarius",
      dates: "Jan 20 - Feb 18",
      description: "Aquarians are known for being independent, innovative, and humanitarian.",
    }
  } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
    return {
      sign: "Pisces",
      dates: "Feb 19 - Mar 20",
      description: "Pisceans are known for being compassionate, artistic, and intuitive.",
    }
  } else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
    return {
      sign: "Aries",
      dates: "Mar 21 - Apr 19",
      description: "Aries are known for being energetic, courageous, and enthusiastic.",
    }
  } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
    return {
      sign: "Taurus",
      dates: "Apr 20 - May 20",
      description: "Tauruses are known for being reliable, patient, and practical.",
    }
  } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
    return {
      sign: "Gemini",
      dates: "May 21 - Jun 20",
      description: "Geminis are known for being adaptable, communicative, and intellectual.",
    }
  } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
    return {
      sign: "Cancer",
      dates: "Jun 21 - Jul 22",
      description: "Cancers are known for being nurturing, sensitive, and emotional.",
    }
  } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
    return {
      sign: "Leo",
      dates: "Jul 23 - Aug 22",
      description: "Leos are known for being generous, creative, and passionate.",
    }
  } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
    return {
      sign: "Virgo",
      dates: "Aug 23 - Sep 22",
      description: "Virgos are known for being analytical, practical, and detail-oriented.",
    }
  } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
    return {
      sign: "Libra",
      dates: "Sep 23 - Oct 22",
      description: "Libras are known for being diplomatic, gracious, and fair-minded.",
    }
  } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
    return {
      sign: "Scorpio",
      dates: "Oct 23 - Nov 21",
      description: "Scorpios are known for being resourceful, brave, and passionate.",
    }
  } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
    return {
      sign: "Sagittarius",
      dates: "Nov 22 - Dec 21",
      description: "Sagittariuses are known for being optimistic, adventurous, and independent.",
    }
  }
  return { sign: "Unknown", dates: "Unknown", description: "Unable to determine zodiac sign." }
}

// Helper function to determine Eastern Zodiac sign
const getEasternZodiac = (year: number) => {
  const animals = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ]

  // Adjust the calculation to correctly map 2004 to Monkey (index 8)
  // 2004 - 1900 = 104, 104 % 12 = 8 (Monkey)
  const index = (year - 1900) % 12

  // Update the years string to include the correct years for each animal
  const years = [
    "1900, 1912, 1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020",
    "1901, 1913, 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021",
    "1902, 1914, 1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022",
    "1903, 1915, 1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023",
    "1904, 1916, 1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024",
    "1905, 1917, 1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025",
    "1906, 1918, 1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026",
    "1907, 1919, 1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027",
    "1908, 1920, 1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028",
    "1909, 1921, 1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029",
    "1910, 1922, 1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030",
    "1911, 1923, 1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031",
  ]

  return {
    animal: animals[index],
    years: years[index],
    description: "The Eastern zodiac assigns an animal and attributes to each year in a 12-year cycle.",
  }
}

// Helper function to calculate Life Path Number
const calculateLifePathNumber = (birthDate: Date) => {
  const day = birthDate.getDate()
  const month = birthDate.getMonth() + 1
  const year = birthDate.getFullYear()

  const sumDigits = (num: number): number => {
    let sum = 0
    String(num)
      .split("")
      .forEach((digit) => {
        sum += Number.parseInt(digit)
      })
    return sum
  }

  let daySum = sumDigits(day)
  while (daySum > 9 && daySum !== 11 && daySum !== 22 && daySum !== 33 && daySum !== 44) {
    daySum = sumDigits(daySum)
  }

  let monthSum = sumDigits(month)
  while (monthSum > 9 && monthSum !== 11 && monthSum !== 22 && monthSum !== 33 && monthSum !== 44) {
    monthSum = sumDigits(monthSum)
  }

  let yearSum = sumDigits(year)
  while (yearSum > 9 && yearSum !== 11 && yearSum !== 22 && yearSum !== 33 && yearSum !== 44) {
    yearSum = sumDigits(yearSum)
  }

  let lifePathNumber = daySum + monthSum + yearSum
  while (
    lifePathNumber > 9 &&
    lifePathNumber !== 11 &&
    lifePathNumber !== 22 &&
    lifePathNumber !== 33 &&
    lifePathNumber !== 44
  ) {
    lifePathNumber = sumDigits(lifePathNumber)
  }

  let description = ""
  switch (lifePathNumber) {
    case 1:
      description = "Individuals with a Life Path Number of 1 are often natural leaders, independent, and innovative."
      break
    case 2:
      description = "Individuals with a Life Path Number of 2 are often cooperative, sensitive, and diplomatic."
      break
    case 3:
      description = "Individuals with a Life Path Number of 3 are often creative, expressive, and optimistic."
      break
    case 4:
      description = "Individuals with a Life Path Number of 4 are often practical, reliable, and disciplined."
      break
    case 5:
      description = "Individuals with a Life Path Number of 5 are often adventurous, versatile, and freedom-loving."
      break
    case 6:
      description = "Individuals with a Life Path Number of 6 are often responsible, nurturing, and harmonious."
      break
    case 7:
      description = "Individuals with a Life Path Number of 7 are often analytical, intuitive, and spiritual."
      break
    case 8:
      description = "Individuals with a Life Path Number of 8 are often ambitious, powerful, and successful."
      break
    case 9:
      description = "Individuals with a Life Path Number of 9 are often compassionate, generous, and idealistic."
      break
    case 11:
      description =
        "Life Path 11 is a Master Number indicating intuition, inspiration, and spiritual insight. You're likely to be idealistic, visionary, and highly intuitive."
      break
    case 22:
      description =
        "Life Path 22 is a Master Number indicating practical vision, power, and achievement. You're likely to be ambitious, disciplined, and capable of manifesting grand visions."
      break
    case 33:
      description =
        "Life Path 33 is a Master Number indicating compassionate service, nurturing, and spiritual teaching. You're likely to be selfless, loving, and dedicated to helping others."
      break
    case 44:
      description =
        "Life Path 44 is a Master Number indicating solid foundations, discipline, and building lasting structures. You're likely to be a master builder with extraordinary organizational skills."
      break
    default:
      description = "Description not available."
  }

  return { number: lifePathNumber, description: description }
}

// Helper function to calculate Soul Urge Number
const calculateSoulUrgeNumber = (name: string) => {
  const vowels = "AEIOUaeiou"
  let vowelSum = 0

  for (let i = 0; i < name.length; i++) {
    if (vowels.includes(name[i])) {
      const charCode = name.toUpperCase().charCodeAt(i)
      let value = 0

      switch (name[i].toUpperCase()) {
        case "A":
          value = 1
          break
        case "E":
          value = 5
          break
        case "I":
          value = 9
          break
        case "O":
          value = 6
          break
        case "U":
          value = 3
          break
      }
      vowelSum += value
    }
  }

  while (vowelSum > 9 && vowelSum !== 11 && vowelSum !== 22 && vowelSum !== 33 && vowelSum !== 44) {
    let sum = 0
    String(vowelSum)
      .split("")
      .forEach((digit) => {
        sum += Number.parseInt(digit)
      })
    vowelSum = sum
  }

  let description = ""
  switch (vowelSum) {
    case 1:
      description = "A Soul Urge Number of 1 suggests a desire for independence and leadership."
      break
    case 2:
      description = "A Soul Urge Number of 2 suggests a desire for harmony and partnership."
      break
    case 3:
      description = "A Soul Urge Number of 3 suggests a desire for self-expression and creativity."
      break
    case 4:
      description = "A Soul Urge Number of 4 suggests a desire for stability and order."
      break
    case 5:
      description = "A Soul Urge Number of 5 suggests a desire for freedom and adventure."
      break
    case 6:
      description = "A Soul Urge Number of 6 suggests a desire for love and responsibility."
      break
    case 7:
      description = "A Soul Urge Number of 7 suggests a desire for knowledge and introspection."
      break
    case 8:
      description = "A Soul Urge Number of 8 suggests a desire for success and recognition."
      break
    case 9:
      description = "A Soul Urge Number of 9 suggests a desire for compassion and service."
      break
    case 11:
      description =
        "A Soul Urge Number of 11 suggests a desire for spiritual insight and inspiration. You're driven by the need for enlightenment and to inspire others."
      break
    case 22:
      description =
        "A Soul Urge Number of 22 suggests a desire to build something of lasting value. You're driven by the need to create structures that benefit humanity."
      break
    case 33:
      description =
        "A Soul Urge Number of 33 suggests a desire to nurture and heal the world. You're driven by the need to serve others with compassion and love."
      break
    case 44:
      description =
        "A Soul Urge Number of 44 suggests a desire to create solid foundations and practical systems. You're driven by the need to build lasting structures."
      break
    default:
      description = "Description not available."
  }

  return { number: vowelSum, description: description }
}

// Helper function to calculate Destiny Number
const calculateDestinyNumber = (name: string) => {
  let destinyNumber = 0

  for (let i = 0; i < name.length; i++) {
    const charCode = name.toUpperCase().charCodeAt(i)
    let value = 0

    if (charCode >= 65 && charCode <= 90) {
      const letter = String.fromCharCode(charCode)
      switch (letter) {
        case "A":
        case "J":
        case "S":
          value = 1
          break
        case "B":
        case "K":
        case "T":
          value = 2
          break
        case "C":
        case "L":
        case "U":
          value = 3
          break
        case "D":
        case "M":
        case "V":
          value = 4
          break
        case "E":
        case "N":
        case "W":
          value = 5
          break
        case "F":
        case "O":
        case "X":
          value = 6
          break
        case "G":
        case "P":
        case "Y":
          value = 7
          break
        case "H":
        case "Q":
        case "Z":
          value = 8
          break
        case "I":
        case "R":
          value = 9
          break
      }
      destinyNumber += value
    }
  }

  while (
    destinyNumber > 9 &&
    destinyNumber !== 11 &&
    destinyNumber !== 22 &&
    destinyNumber !== 33 &&
    destinyNumber !== 44
  ) {
    let sum = 0
    String(destinyNumber)
      .split("")
      .forEach((digit) => {
        sum += Number.parseInt(digit)
      })
    destinyNumber = sum
  }

  let description = ""
  switch (destinyNumber) {
    case 1:
      description = "A Destiny Number of 1 suggests a path of leadership and innovation."
      break
    case 2:
      description = "A Destiny Number of 2 suggests a path of cooperation and diplomacy."
      break
    case 3:
      description = "A Destiny Number of 3 suggests a path of creativity and self-expression."
      break
    case 4:
      description = "A Destiny Number of 4 suggests a path of hard work and stability."
      break
    case 5:
      description = "A Destiny Number of 5 suggests a path of adventure and change."
      break
    case 6:
      description = "A Destiny Number of 6 suggests a path of service and harmony."
      break
    case 7:
      description = "A Destiny Number of 7 suggests a path of knowledge and spirituality."
      break
    case 8:
      description = "A Destiny Number of 8 suggests a path of success and influence."
      break
    case 9:
      description = "A Destiny Number of 9 suggests a path of compassion and philanthropy."
      break
    case 11:
      description =
        "A Destiny Number of 11 suggests a path of spiritual insight and inspiration. Your life's purpose involves developing intuition and inspiring others."
      break
    case 22:
      description =
        "A Destiny Number of 22 suggests a path of practical mastery and building. Your life's purpose involves creating structures that benefit many people."
      break
    case 33:
      description =
        "A Destiny Number of 33 suggests a path of spiritual teaching and healing. Your life's purpose involves uplifting humanity through compassionate service."
      break
    case 44:
      description =
        "A Destiny Number of 44 suggests a path of solid foundations and practical systems. Your life's purpose involves building lasting structures and organizations."
      break
    default:
      description = "Description not available."
  }

  return { number: destinyNumber, description: description }
}

export default function PersonalBio() {
  // Hardcoded personal information
  const birthDate = new Date(2004, 7, 5, 18, 31) // August 5, 2004, 6:31 PM
  const name = "Christian Lamar Coleman" // Used for calculations but not displayed

  const [now, setNow] = useState(new Date())
  const [ageInfo, setAgeInfo] = useState<AgeInfo | null>(null)

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Recalculate age whenever the current time updates
  useEffect(() => {
    calculateAge(birthDate, name, now)
  }, [now])

  const calculateAge = (birthDate: Date, name: string, currentTime: Date) => {
    // Calculate total age in milliseconds
    const ageInMilliseconds = currentTime.getTime() - birthDate.getTime()
    const ageInSeconds = Math.floor(ageInMilliseconds / 1000)

    // Calculate years, months, days
    let years = currentTime.getFullYear() - birthDate.getFullYear()
    let months = currentTime.getMonth() - birthDate.getMonth()
    let days = currentTime.getDate() - birthDate.getDate()

    // Adjust for month/day differences
    if (months < 0 || (months === 0 && days < 0)) {
      years--
      months += 12
    }

    if (days < 0) {
      // Get the number of days in the previous month
      const prevMonthDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), 0)
      days += prevMonthDate.getDate()
      months--
    }

    // Calculate hours, minutes, seconds of the day
    let hours = currentTime.getHours() - birthDate.getHours()
    let minutes = currentTime.getMinutes() - birthDate.getMinutes()
    let seconds = currentTime.getSeconds() - birthDate.getSeconds()

    // Adjust for time differences
    if (seconds < 0) {
      seconds += 60
      minutes--
    }

    if (minutes < 0) {
      minutes += 60
      hours--
    }

    if (hours < 0) {
      hours += 24
      days--
    }

    // Calculate western zodiac sign
    const westernZodiac = getWesternZodiac(birthDate.getMonth() + 1, birthDate.getDate())

    // Calculate eastern zodiac sign
    const easternZodiac = getEasternZodiac(birthDate.getFullYear())

    // Calculate numerology numbers
    const lifePathNumber = calculateLifePathNumber(birthDate)
    const soulUrgeNumber = calculateSoulUrgeNumber(name)
    const destinyNumber = calculateDestinyNumber(name)

    setAgeInfo({
      birthDate,
      now: currentTime,
      ageInYears: years,
      ageInMonths: months,
      ageInDays: days,
      ageInHours: hours,
      ageInMinutes: minutes,
      ageInSeconds: seconds,
      ageInTotalSeconds: ageInSeconds,
      westernZodiac,
      easternZodiac,
      lifePathNumber,
      soulUrgeNumber,
      destinyNumber,
    })
  }

  if (!ageInfo) return <div>Loading...</div>

  return (
    <Box className="w-full max-w-3xl mx-auto">
      <Tabs defaultValue="age" className="mt-2">
        <TabsList className="grid grid-cols-3 rounded-none">
          <TabsTrigger value="age" className="rounded-none">Age</TabsTrigger>
          <TabsTrigger value="zodiac" className="rounded-none">Zodiac</TabsTrigger>
          <TabsTrigger value="numerology" className="rounded-none">Numerology</TabsTrigger>
        </TabsList>

        <TabsContent value="age" className="space-y-4">
          <Box className="p-4">
            <h3 className="font-medium mb-2">My Age</h3>
            <p>
              I was born on {format(ageInfo.birthDate, "MMMM d, yyyy")}, at {format(ageInfo.birthDate, "h:mm a")}.
            </p>
            <p className="mt-2">
              As of <span className="font-mono">{ageInfo.now.toLocaleString()}</span>, I am:
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-background border border-border p-3 text-center">
                <span className="text-2xl font-bold tabular-nums">{ageInfo.ageInYears}</span>
                <span className="block text-xs text-muted-foreground">years</span>
              </div>
              <div className="bg-background border border-border p-3 text-center">
                <span className="text-2xl font-bold tabular-nums">{ageInfo.ageInMonths}</span>
                <span className="block text-xs text-muted-foreground">months</span>
              </div>
              <div className="bg-background border border-border p-3 text-center">
                <span className="text-2xl font-bold tabular-nums">{ageInfo.ageInDays}</span>
                <span className="block text-xs text-muted-foreground">days</span>
              </div>
              <div className="bg-background border border-border p-3 text-center">
                <span className="text-2xl font-bold tabular-nums">{ageInfo.ageInHours}</span>
                <span className="block text-xs text-muted-foreground">hours</span>
              </div>
              <div className="bg-background border border-border p-3 text-center">
                <span className="text-2xl font-bold tabular-nums">{ageInfo.ageInMinutes}</span>
                <span className="block text-xs text-muted-foreground">minutes</span>
              </div>
              <div className="bg-background border border-border p-3 text-center">
                <span className="text-2xl font-bold tabular-nums">{ageInfo.ageInSeconds}</span>
                <span className="block text-xs text-muted-foreground">seconds</span>
              </div>
            </div>
            <p className="mt-4">
              That's approximately{" "}
              <span className="font-mono font-bold">{ageInfo.ageInTotalSeconds.toLocaleString()}</span> seconds since
              my birth.
            </p>
          </Box>
        </TabsContent>

        <TabsContent value="zodiac" className="space-y-4">
          <Box className="p-4">
            <h3 className="font-medium mb-2">Western Zodiac Sign</h3>
            <p className="text-lg font-semibold">{ageInfo.westernZodiac.sign}</p>
            <p className="mt-1">{ageInfo.westernZodiac.dates}</p>
            <p className="mt-2">{ageInfo.westernZodiac.description}</p>
          </Box>

          <Box className="p-4">
            <h3 className="font-medium mb-2">Eastern Zodiac Sign</h3>
            <p className="text-lg font-semibold">{ageInfo.easternZodiac.animal}</p>
            <p className="mt-1">{ageInfo.easternZodiac.years}</p>
            <p className="mt-2">{ageInfo.easternZodiac.description}</p>
          </Box>
        </TabsContent>

        <TabsContent value="numerology" className="space-y-4">
          <Box className="p-4">
            <h3 className="font-medium mb-2">Life Path Number: {ageInfo.lifePathNumber.number}</h3>
            <p>{ageInfo.lifePathNumber.description}</p>
          </Box>

          <Box className="p-4">
            <h3 className="font-medium mb-2">Soul Urge Number: {ageInfo.soulUrgeNumber.number}</h3>
            <p>{ageInfo.soulUrgeNumber.description}</p>
          </Box>

          <Box className="p-4">
            <h3 className="font-medium mb-2">Destiny Number: {ageInfo.destinyNumber.number}</h3>
            <p>{ageInfo.destinyNumber.description}</p>
          </Box>
        </TabsContent>
      </Tabs>
    </Box>
  )
}

// Types
interface AgeInfo {
  birthDate: Date
  now: Date
  ageInYears: number
  ageInMonths: number
  ageInDays: number
  ageInHours: number
  ageInMinutes: number
  ageInSeconds: number
  ageInTotalSeconds: number
  westernZodiac: {
    sign: string
    dates: string
    description: string
  }
  easternZodiac: {
    animal: string
    years: string
    description: string
  }
  lifePathNumber: {
    number: number
    description: string
  }
  soulUrgeNumber: {
    number: number
    description: string
  }
  destinyNumber: {
    number: number
    description: string
  }
}

