#!/usr/bin/env python3
"""
Static Blog Generator for Rammed Earth Chronicles
Converts markdown posts to HTML and auto-generates archive page
"""

import os
import re
from datetime import datetime
from pathlib import Path
import argparse


def parse_frontmatter(content):
    """Extract YAML-style frontmatter from markdown content"""
    frontmatter = {}
    body = content

    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter_text = parts[1].strip()
            body = parts[2].strip()

            # Parse frontmatter
            for line in frontmatter_text.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip().strip('"\'')

    return frontmatter, body


def markdown_to_html(markdown_text):
    """Convert simple markdown to HTML (paragraphs, bold, italic, links)"""
    html = markdown_text

    # Bold: **text** or __text__
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'__(.+?)__', r'<strong>\1</strong>', html)

    # Italic: *text* or _text_
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    html = re.sub(r'_(.+?)_', r'<em>\1</em>', html)

    # Links: [text](url)
    html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2" target="_blank">\1</a>', html)

    # Paragraphs: split by double newlines
    paragraphs = html.split('\n\n')
    html_paragraphs = [f'            <p>{p.strip()}</p>' for p in paragraphs if p.strip()]

    return '\n\n'.join(html_paragraphs)


def extract_sources(markdown_text):
    """Extract sources section from markdown"""
    sources = []

    # Look for "## Sources" or "## This Week's Sources" section
    if '## Sources' in markdown_text or '## This Week\'s Sources' in markdown_text:
        parts = re.split(r'##\s+(?:This Week\'s )?Sources', markdown_text)
        if len(parts) > 1:
            sources_text = parts[1].strip()

            # Extract links: - [Title](URL) or * [Title](URL)
            for line in sources_text.split('\n'):
                match = re.match(r'[-*]\s+\[(.+?)\]\((.+?)\)', line.strip())
                if match:
                    title, url = match.groups()
                    sources.append({'title': title, 'url': url})

    return sources


def generate_html(markdown_file, template_path):
    """Generate HTML from markdown file using template"""
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse frontmatter and body
    frontmatter, body = parse_frontmatter(content)

    # Extract metadata
    date_str = frontmatter.get('date', '')
    title = frontmatter.get('title', 'Weekly Bites')

    # Format date
    if date_str:
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            formatted_date = date_obj.strftime('%B %d, %Y')
            file_date = date_str
        except ValueError:
            formatted_date = date_str
            file_date = datetime.now().strftime('%Y-%m-%d')
    else:
        formatted_date = datetime.now().strftime('%B %d, %Y')
        file_date = datetime.now().strftime('%Y-%m-%d')

    # Extract sources from body
    sources = extract_sources(body)

    # Remove sources section from body
    body = re.split(r'##\s+(?:This Week\'s )?Sources', body)[0].strip()

    # Convert markdown to HTML
    html_content = markdown_to_html(body)

    # Read template
    with open(template_path, 'r', encoding='utf-8') as f:
        template = f.read()

    # Replace placeholders
    html = template.replace('[MONTH DAY, YEAR]', formatted_date)
    html = html.replace('[DATE]', formatted_date)

    # Replace story content
    story_pattern = r'<div class="story">.*?</div>'
    story_html = f'<div class="story">\n{html_content}\n        </div>'
    html = re.sub(story_pattern, story_html, html, flags=re.DOTALL)

    # Replace sources
    if sources:
        sources_html = '<ul>\n'
        for source in sources:
            sources_html += f'                <li>→ <a href="{source["url"]}" target="_blank">{source["title"]}</a></li>\n'
        sources_html += '            </ul>'

        sources_pattern = r'<ul>.*?</ul>'
        html = re.sub(sources_pattern, sources_html, html, flags=re.DOTALL)

    # Update meta tags
    html = html.replace('weekly-bites-template.html', f'weekly-bites-{file_date}.html')

    # Remove usage instructions
    html = re.sub(r'<!--\s*USAGE INSTRUCTIONS:.*?-->', '', html, flags=re.DOTALL)

    return html, file_date, formatted_date, body[:150]


def update_archive(posts_info, archive_path):
    """Update the archive page with new posts"""
    with open(archive_path, 'r', encoding='utf-8') as f:
        archive = f.read()

    # Find the container div and existing entries
    container_match = re.search(r'(<div class="subtitle">.*?</div>)(.*?)(</div>\s*<div class="nav">)', archive, re.DOTALL)

    if not container_match:
        print("Warning: Could not find insertion point in archive")
        return

    header = container_match.group(1)
    footer = container_match.group(3)

    # Generate new entries HTML
    entries_html = '\n\n'
    for post in sorted(posts_info, key=lambda x: x['date'], reverse=True):
        entries_html += f'''        <div class="entry">
            <div class="entry-date">{post['formatted_date']}</div>
            <div class="entry-excerpt">{post['excerpt']}...</div>
            <a href="weekly-bites-{post['date']}.html" class="entry-link">Read more →</a>
        </div>

'''

    # Reconstruct archive
    new_archive = archive.split('<div class="subtitle">')[0] + header + entries_html + '    ' + footer
    new_archive = re.sub(r'</div>\s*<div class="nav">', '</div>\n\n    <div class="nav">', new_archive)

    with open(archive_path, 'w', encoding='utf-8') as f:
        f.write(new_archive)

    print(f"✓ Updated archive with {len(posts_info)} posts")


def main():
    parser = argparse.ArgumentParser(description='Generate static blog from markdown files')
    parser.add_argument('--posts-dir', default='blog/posts', help='Directory containing markdown posts')
    parser.add_argument('--output-dir', default='.', help='Output directory for HTML files')
    parser.add_argument('--template', default='weekly-bites-template.html', help='HTML template file')
    parser.add_argument('--archive', default='weekly-bites-archive.html', help='Archive page to update')

    args = parser.parse_args()

    posts_dir = Path(args.posts_dir)
    output_dir = Path(args.output_dir)
    template_path = Path(args.template)
    archive_path = Path(args.archive)

    if not posts_dir.exists():
        print(f"Error: Posts directory '{posts_dir}' not found")
        return

    if not template_path.exists():
        print(f"Error: Template file '{template_path}' not found")
        return

    # Find all markdown files
    md_files = list(posts_dir.glob('*.md'))

    if not md_files:
        print(f"No markdown files found in {posts_dir}")
        return

    print(f"Found {len(md_files)} markdown posts")

    posts_info = []

    # Generate HTML for each markdown file
    for md_file in md_files:
        print(f"\nProcessing: {md_file.name}")

        try:
            html, file_date, formatted_date, excerpt = generate_html(md_file, template_path)

            # Write HTML file
            output_file = output_dir / f'weekly-bites-{file_date}.html'
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html)

            print(f"  ✓ Generated: {output_file.name}")

            posts_info.append({
                'date': file_date,
                'formatted_date': formatted_date,
                'excerpt': excerpt.replace('\n', ' ').strip()
            })

        except Exception as e:
            print(f"  ✗ Error: {e}")

    # Update archive
    if posts_info and archive_path.exists():
        update_archive(posts_info, archive_path)

    print(f"\n✓ Done! Generated {len(posts_info)} HTML files")


if __name__ == '__main__':
    main()
