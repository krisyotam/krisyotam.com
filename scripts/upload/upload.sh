#!/bin/bash 

# upload: script for uploading PDFs, images, and other media to krisyotam.com. Handles naming & reformatting 
# Author: Kris Yotam
# Date: 2025-09-11
# When: Time-Stamp: ""
# License: CC-0
#
# Upload files to krisyotam.com
# Usage:
# $ 

Directory Structure
---
- doc/
    - literature/ --> LCC Classification 
    - films/
    - papers/
    - images/
    - videos/
        - interviews/
        - documentaries/
        - lectures/
    - audio/
    - data/
    - websites/
    - cases/
    - dossiers/


Heres a example of the type of command this script will run to find files:
find / -type f -name "larbs-dwm.pdf" 2>/dev/null

It will prompt me heavily to find out where a file should go, and once decided it will ask the file name, and 
run a cmd like that display the full path and ask me to confirm, then upload it to the right place. 

there needs to be a index of where files go. such as it will ask me if its a book, paper, image, video, audio, other, and then move to 
subtypes. and for ex. ask if it is a case or dossier which are placed specifically in certain sections 

The script should ask details like author, title, year, publisher, ect. for books and papers and use this to rename the file, and 
add metadata. 