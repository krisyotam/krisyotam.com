import json
import re
import os
from bs4 import BeautifulSoup # Added import

# def extract_text_from_html_tags(html_fragment): # This function is no longer strictly needed with BeautifulSoup's .text, but can be kept if complex cleaning is required later.
#     """
#     Extracts clean text from an HTML fragment, typically a table cell content.
#     It removes HTML tags and decodes HTML entities like '&amp;'.
#     """
#     html_fragment = re.sub(r'<!--.*?-->', '', html_fragment, flags=re.DOTALL)
#     text_content = re.sub(r'<[^>]+>', '', html_fragment)
#     text_content = text_content.replace('&amp;', '&').strip()
#     return text_content

def parse_billboard_html(html_content):
    """
    Parses the HTML content of the billboard.html file to extract the year and song list
    using BeautifulSoup.
    """
    year = None
    # Try to extract year from a specific link format first (existing logic)
    year_match_specific = re.search(r'songs of <a href="/wiki/(\d{4})_in_music"[^>]*>\d{4}</a>', html_content)
    if year_match_specific:
        year = year_match_specific.group(1)
    else:
        year_match_general = re.search(r'songs of (\d{4})\b', html_content)
        if year_match_general:
            year = year_match_general.group(1)
        else:
            first_part_of_content = html_content[:500] 
            year_match_fallback = re.search(r'\b(19\d{2}|20\d{2})\b', first_part_of_content)
            if year_match_fallback:
                year = year_match_fallback.group(1)
                print(f"Warning: Year determination is a fallback, found: {year}")
            else:
                print("Error: Could not determine the year from the content.")
                return None, []

    soup = BeautifulSoup(html_content, "html.parser")
    table = soup.find("table", class_="wikitable")
    if not table:
        print("Error: Could not find the wikitable in the HTML.")
        return year, []

    rows = table.select("tr")[1:]  # Skip header row

    songs = []
    base_url = "https://en.wikipedia.org"

    for row in rows:
        cols = row.find_all("td")
        if len(cols) >= 3:
            try:
                placement = int(cols[0].text.strip())

                # Song data
                title_cell = cols[1]
                title_tag = title_cell.find("a")
                song_title = title_tag.text.strip() if title_tag else title_cell.text.strip().strip('"') # Strip quotes if no link
                song_url = None
                if title_tag and title_tag.has_attr("href"):
                    href = title_tag["href"]
                    song_url = base_url + href if href.startswith("/wiki/") else href
                
                # Artist data
                artist_cell = cols[2]
                artist_links = artist_cell.find_all("a")
                artist_names = []
                artist_urls = []

                if artist_links:
                    for a_tag in artist_links:
                        artist_names.append(a_tag.text.strip())
                        if a_tag.has_attr("href"):
                            href = a_tag["href"]
                            artist_urls.append(base_url + href if href.startswith("/wiki/") else href)
                else: # Fallback if no <a> tags in artist cell
                    artist_names.append(artist_cell.text.strip())


                song_entry = {
                    "placement": placement,
                    "song": song_title,
                    "artist": ", ".join(artist_names), # Join multiple artists if present
                    "song_url": song_url,
                    "artist_urls": artist_urls
                }
                songs.append(song_entry)
            except ValueError:
                print(f"Skipping a row due to ValueError (likely non-integer in placement): {cols[0].text}")
            except Exception as e:
                print(f"Skipping a row due to an unexpected error: {e}. Row content: {row.text}")
        elif len(cols) > 0 : # Handle rows that might not have enough columns (e.g. malformed, or notes)
             print(f"Skipping row with insufficient columns: {len(cols)} found, expected 3. Content: {cols[0].text if cols else 'Empty row'}")


    if songs:
        print(f"Successfully parsed {len(songs)} songs using BeautifulSoup.")
    else:
        print("Warning: BeautifulSoup parsing did not yield any songs.")

    return year, songs

def main():
    workspace_root = r"c:\\Users\\Kris Yotam\\Music\\name1"
    # Updated to billboard.html
    html_file_path = os.path.join(workspace_root, "data", "billboard", "billboard.html")
    json_file_path = os.path.join(workspace_root, "data", "billboard", "billboard-top-100.json")
    
    os.makedirs(os.path.dirname(json_file_path), exist_ok=True)
    script_dir = os.path.join(workspace_root, "scripts")
    os.makedirs(script_dir, exist_ok=True)

    try:
        # Updated variable name for clarity
        with open(html_file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        # Updated variable name in error message
        print(f"Error: Input file not found at {html_file_path}")
        return
    except Exception as e:
        print(f"Error reading input file {html_file_path}: {e}")
        return

    year, songs = parse_billboard_html(html_content)

    if not year:
        print("Could not determine year. Aborting JSON update.")
        return
    if not songs:
        print(f"No songs found for year {year} or parsing failed. JSON will not be updated with new songs for this year.")
        # Still, we might want to save the JSON if other years exist or if year was found but no songs.
        # For now, if no songs, we won't add an empty list for the year unless the year key is new.

    all_data = {}
    if os.path.exists(json_file_path) and os.path.getsize(json_file_path) > 0:
        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                all_data = json.load(f)
        except json.JSONDecodeError:
            print(f"Warning: {json_file_path} contains invalid JSON or is empty. It will be overwritten if new data is valid.")
            all_data = {} # Reset if malformed
        except Exception as e:
            print(f"Error reading JSON file {json_file_path}: {e}. Proceeding with empty data.")
            all_data = {}
            
    if songs: # Only add/update if songs were actually found
        all_data[year] = songs
        print(f"Data for year {year} prepared with {len(songs)} songs.")
    elif year not in all_data: # If no songs, but year is new, perhaps add an empty list? Or skip.
        print(f"No songs found for year {year}, and year is not in JSON. Year {year} will not be added.")


    if not all_data and not songs:
        print("No data to write to JSON file as no prior data existed and no new songs were parsed.")
        return

    try:
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, indent=2, sort_keys=True) # Sort keys for consistent year ordering
        print(f"Successfully updated {json_file_path}")
        if not songs and year in all_data:
             print(f"Note: No new songs were parsed for year {year}, so existing data for this year (if any) remains unchanged or was cleared if parsing was expected.")
        elif not songs:
             print(f"Note: No new songs were parsed for year {year}.")


    except Exception as e:
        print(f"Error writing to JSON file {json_file_path}: {e}")

if __name__ == '__main__':
    main()
