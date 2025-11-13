# Weekly Bites Blog System

Static blog generator for Weekly Bites posts using Python and Markdown.

## Quick Start

### 1. Create a new post

```bash
# Copy the template
cp blog/TEMPLATE.md blog/posts/2025-01-17.md

# Edit the markdown file
# - Update the date in frontmatter
# - Write your 4-paragraph story (~300 words)
# - Add 3-5 sources at the bottom
```

### 2. Generate HTML

```bash
# Run the generator
python3 generate_blog.py

# This will:
# - Convert all markdown files in blog/posts/ to HTML
# - Create weekly-bites-YYYY-MM-DD.html files
# - Auto-update weekly-bites-archive.html
```

### 3. Commit and push

```bash
git add weekly-bites-*.html blog/posts/*.md
git commit -m "Weekly Bites: January 17, 2025"
git push
```

## Markdown Format

### Frontmatter (Required)

```yaml
---
date: 2025-01-17
title: Weekly Bites
---
```

### Body (4 paragraphs, ~300 words)

- Keep it story-driven, not list-driven
- Each paragraph ~75 words
- End with reflection/question

### Sources Section

```markdown
## Sources

- [Article Title](https://example.com)
- [Another Source](https://example.com)
```

## Markdown Syntax Supported

- **Bold**: `**text**` or `__text__`
- *Italic*: `*text*` or `_text_`
- Links: `[text](url)`
- Paragraphs: Double line break

## File Structure

```
blog/
├── posts/          # Published markdown posts
│   └── 2025-01-17.md
├── drafts/         # Work in progress
│   └── draft.md
├── TEMPLATE.md     # Template for new posts
└── README.md       # This file

generate_blog.py    # Python generator script
weekly-bites-*.html # Generated HTML files
weekly-bites-archive.html  # Auto-updated archive
```

## Script Options

```bash
# Custom directories
python3 generate_blog.py --posts-dir blog/posts --output-dir .

# Custom template
python3 generate_blog.py --template my-template.html

# Custom archive file
python3 generate_blog.py --archive my-archive.html
```

## Tips

1. **Draft first**: Write in `blog/drafts/` until ready
2. **Move to posts**: `mv blog/drafts/draft.md blog/posts/2025-01-17.md`
3. **Run generator**: `python3 generate_blog.py`
4. **Preview**: Open the generated HTML in a browser
5. **Iterate**: Edit markdown, regenerate, repeat
6. **Publish**: Commit and push when satisfied

## Example Post

See `blog/TEMPLATE.md` for the structure and `blog/posts/` for examples.
