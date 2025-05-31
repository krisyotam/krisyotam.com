import os

# Define the range of years
years = range(1962, 2026)

# Define the base directories
json_dir = "c:/Users/Kris Yotam/Music/name1/data/billboard"
html_dir = os.path.join(json_dir, "html-data")

# Ensure directories exist
os.makedirs(json_dir, exist_ok=True)
os.makedirs(html_dir, exist_ok=True)

# Create JSON and HTML files
for year in years:
    json_file = os.path.join(json_dir, f"{year}.json")
    html_file = os.path.join(html_dir, f"{year}.html")

    # Create empty JSON file if it doesn't exist
    if not os.path.exists(json_file):
        with open(json_file, "w") as jf:
            jf.write("{}")

    # Create empty HTML file if it doesn't exist
    if not os.path.exists(html_file):
        with open(html_file, "w") as hf:
            hf.write("<!-- HTML data for year {year} -->")

print("Files created successfully.")
