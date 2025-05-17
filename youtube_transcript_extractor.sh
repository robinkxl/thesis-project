#!/bin/bash

# YouTube Transcript Extractor
# This script downloads and extracts the transcript from a YouTube video,
# calculates some statistics, and copies the result to the clipboard.

# Instructions:
# 1. Ensure you have the following dependencies installed:
#    - yt-dlp: https://github.com/yt-dlp/yt-dlp#installation
#    - jq: https://stedolan.github.io/jq/download/
#    - xclip (for Linux) or pbcopy (for macOS, comes pre-installed)
# 2. Make this script executable: chmod +x youtube_transcript_extractor.sh
# 3. Run the script with a YouTube URL: ./youtube_transcript_extractor.sh "https://www.youtube.com/watch?v=VIDEO_ID"

# Requirements:
# - Linux or macOS
# - Bash shell
# - yt-dlp
# - jq
# - xclip (Linux) or pbcopy (macOS)

# Function to copy to clipboard
copy_to_clipboard() {
    if command -v pbcopy > /dev/null; then
        pbcopy
    elif command -v xclip > /dev/null; then
        xclip -selection clipboard
    else
        echo "Unable to copy to clipboard: neither pbcopy nor xclip is available."
        return 1
    fi
}

# Function to format duration
format_duration() {
    local total_seconds=$1
    local hours=$((total_seconds / 3600))
    local minutes=$(( (total_seconds % 3600) / 60 ))
    local seconds=$((total_seconds % 60))
    printf "%02d:%02d:%02d" $hours $minutes $seconds
}

# Check if a URL is provided
if [ $# -eq 0 ]; then
    echo "Please provide a YouTube video URL as an argument."
    echo "Usage: $0 <YouTube_URL>"
    exit 1
fi

# YouTube video URL
URL="$1"

# Download subtitles and metadata
yt-dlp --skip-download --write-subs --write-auto-subs --sub-lang en --sub-format ttml --convert-subs srt --output "transcript.%(ext)s" --write-info-json "$URL"

# Clean up the subtitle file
sed -i.bak -e '/^[0-9][0-9]:[0-9][0-9]:[0-9][0-9].[0-9][0-9][0-9] --> [0-9][0-9]:[0-9][0-9]:[0-9][0-9].[0-9][0-9][0-9]$/d' \
    -e '/^[[:digit:]]\{1,3\}$/d' \
    -e 's/<[^>]*>//g' \
    ./transcript.en.srt && rm ./transcript.en.srt.bak

# Create the final output file
sed -e 's/<[^>]*>//g' -e '/^[[:space:]]*$/d' transcript.en.srt > output.txt

# Remove the intermediate .srt file
rm transcript.en.srt

echo "Transcript extraction complete. The result is saved in output.txt"

# Calculate word count and line count
WORD_COUNT=$(wc -w < output.txt)
LINE_COUNT=$(wc -l < output.txt)

# Extract metadata
TITLE=$(jq -r '.title' transcript.info.json)
DURATION=$(jq -r '.duration' transcript.info.json)
UPLOAD_DATE=$(jq -r '.upload_date' transcript.info.json)

# Format duration
DURATION_FORMATTED=$(format_duration $DURATION)

# Prepare metadata string
METADATA="Video Title: $TITLE
Duration: $DURATION_FORMATTED
Upload Date: ${UPLOAD_DATE:0:4}-${UPLOAD_DATE:4:2}-${UPLOAD_DATE:6:2}
Word Count: $WORD_COUNT
Line Count: $LINE_COUNT"

echo "Transcript Statistics and Metadata:"
echo "$METADATA"

# Copy the transcript to clipboard with the specified format and metadata
{
    echo "The following youtube video transcript:"
    echo ""
    cat output.txt
    echo ""
} | copy_to_clipboard

if [ $? -eq 0 ]; then
    echo "Transcript and metadata have been copied to clipboard."
else
    echo "Transcript and metadata were not copied to clipboard due to an error."
fi

# Clean up metadata file
rm transcript.info.json