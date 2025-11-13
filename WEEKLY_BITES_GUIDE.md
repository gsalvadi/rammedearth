# Weekly Bites Publishing Guide

A step-by-step guide for creating and publishing weekly content updates.

---

## Overview

**What:** ~300-word weekly posts about rammed earth developments
**Source:** Google Alerts and research
**Format:** Markdown → HTML via Python generator
**Publishing:** Weekly (pick a consistent day)

---

## Step 1: Gather Content (Throughout the Week)

### Set Up Google Alerts

1. Go to https://google.com/alerts
2. Create alerts for:
   - "rammed earth" + news
   - "earthen building" + research
   - "adobe construction" + developments
   - "sustainable building materials"

3. Set delivery to "Daily" or "As-it-happens"
4. Send to your email

### Collect Links

- **Save 3-5 interesting links** throughout the week
- Look for: research papers, news articles, projects, techniques, trends
- Ask yourself: "What pattern or question emerges from these?"

---

## Step 2: Write the Post (30-60 minutes)

### Navigate to Blog Folder

```bash
cd /home/user/rammedearth
```

### Copy the Template

```bash
# Use today's date in YYYY-MM-DD format
cp blog/TEMPLATE.md blog/posts/2025-01-17.md
```

### Edit the Markdown File

Open `blog/posts/2025-01-17.md` in your text editor.

#### Update Frontmatter

```markdown
---
date: 2025-01-17
title: Weekly Bites
---
```

Change `YYYY-MM-DD` to the actual date.

#### Write 4 Paragraphs (~300 words total)

**Paragraph 1 (~75 words):** Opening observation
- Start with something specific you noticed this week
- A pattern, question, or surprising fact
- Make it concrete, not abstract

**Paragraph 2 (~75 words):** Development with examples
- Build on your opening
- Connect dots between different sources
- Provide evidence or context

**Paragraph 3 (~75 words):** Deeper pattern
- What's the larger pattern emerging?
- How do these pieces fit together?
- Make unexpected connections

**Paragraph 4 (~75 words):** Reflection
- End with a question to ponder or philosophical angle
- Leave the reader thinking
- Don't try to resolve everything

#### Add Sources Section

```markdown
## Sources

- [Article Title 1](https://example.com/article1)
- [Article Title 2](https://example.com/article2)
- [Article Title 3](https://example.com/article3)
```

Use 3-5 sources. Mix research, news, and practice.

---

## Step 3: Preview the Post (Optional)

### Check Word Count

```bash
# Count words in your post (excluding frontmatter)
wc -w blog/posts/2025-01-17.md
```

Aim for 250-350 words (excluding sources).

### Read Aloud

- Read your post out loud
- Does it flow naturally?
- Is there a clear thread connecting all 4 paragraphs?

---

## Step 4: Generate HTML

### Run the Generator

```bash
python3 generate_blog.py
```

**What this does:**
- Converts your markdown to HTML
- Creates `weekly-bites-2025-01-17.html`
- Updates `updates.html` with new entry

### Check for Errors

Look for output like:
```
Found 1 markdown posts
Processing: 2025-01-17.md
  ✓ Generated: weekly-bites-2025-01-17.html
✓ Done! Generated 1 HTML files
```

If you see errors, check:
- Date format in frontmatter is `YYYY-MM-DD`
- No special characters breaking markdown
- Sources section uses proper markdown link format

---

## Step 5: Preview in Browser (Optional)

### Open Generated HTML

```bash
# Linux/Mac
open weekly-bites-2025-01-17.html

# Or just open the file in your browser manually
```

### Check:
- ✅ Date displays correctly
- ✅ All 4 paragraphs are there
- ✅ Sources appear in the box at bottom
- ✅ Links work
- ✅ Styling looks good

---

## Step 6: Commit to Git

### Stage Files

```bash
git add weekly-bites-2025-01-17.html blog/posts/2025-01-17.md updates.html
```

**What you're adding:**
- New HTML post
- New markdown source
- Updated updates.html (archive page)

### Create Commit

```bash
git commit -m "Weekly Bites: January 17, 2025"
```

### Check Status

```bash
git status
```

Should show:
```
On branch claude/continue-project-011CV4njhn2XzX2cNDpaiCtX
Your branch is ahead of 'origin/claude/continue-project-011CV4njhn2XzX2cNDpaiCtX' by 1 commit.
nothing to commit, working tree clean
```

---

## Step 7: Push to GitHub

### Push Changes

```bash
git push -u origin claude/continue-project-011CV4njhn2XzX2cNDpaiCtX
```

**If you get "fetch first" error:**

```bash
git pull --rebase origin claude/continue-project-011CV4njhn2XzX2cNDpaiCtX
git push -u origin claude/continue-project-011CV4njhn2XzX2cNDpaiCtX
```

### Verify Deployment

1. Wait 2-3 minutes for GitHub Pages to build
2. Visit: `https://rammedearth.in/updates.html`
3. Your new post should appear at the top

---

## Step 8: Share (Optional)

### Get Direct Link

```
https://rammedearth.in/weekly-bites-2025-01-17.html
```

### Share On:
- Substack (link back from your main posts)
- Social media (if you use it)
- Email newsletter (excerpt with link)

---

## Troubleshooting

### "Invalid Date" Error

**Problem:** Jekyll trying to parse template files

**Solution:** Template files should be in `blog/` folder which is excluded in `_config.yml`. If you see this error, the file might be in the wrong location.

### Generator Can't Find Posts

**Problem:** `No markdown files found in blog/posts`

**Solution:**
- Check you're running from `/home/user/rammedearth` directory
- Check the file is in `blog/posts/` not `blog/`
- Check the file has `.md` extension

### Archive Not Updating

**Problem:** `updates.html` doesn't show new post

**Solution:**
- The generator script has a known minor bug with archive updates
- Manually add entry to `updates.html` after the `<!-- Generated by -->` comment
- Copy the template structure from existing entries

**Manual entry format:**
```html
<div class="entry">
    <div class="entry-date">January 17, 2025</div>
    <div class="entry-excerpt">
        First 100-150 characters of your post...
    </div>
    <a href="weekly-bites-2025-01-17.html" class="entry-link">Read more →</a>
</div>
```

### Push Rejected / Merge Conflict

**Problem:** Someone else pushed to the branch

**Solution:**
```bash
git pull --rebase origin claude/continue-project-011CV4njhn2XzX2cNDpaiCtX
# Fix any conflicts if they appear
git push -u origin claude/continue-project-011CV4njhn2XzX2cNDpaiCtX
```

---

## Markdown Formatting Reference

### Bold Text
```markdown
**bold text**
```
Output: **bold text**

### Italic Text
```markdown
*italic text*
```
Output: *italic text*

### Links
```markdown
[Link Text](https://example.com)
```
Output: [Link Text](https://example.com)

### Paragraphs
```markdown
First paragraph.

Second paragraph (double line break).
```

---

## Writing Tips

### Start Strong
❌ "This week I read some interesting articles about rammed earth."
✅ "Three different architects in humid climates told me the same thing: unstabilized rammed earth performs better than they expected."

### Tell a Story, Not a List
❌ "Article 1 says X. Article 2 says Y. Article 3 says Z."
✅ "When you look at these three examples together, a pattern emerges..."

### End with Resonance
❌ "In conclusion, rammed earth is interesting."
✅ "Maybe the question isn't whether the material is appropriate, but whether we're willing to wait long enough to learn it."

### Show, Don't Tell
❌ "Rammed earth is sustainable."
✅ "A wall built in 1820 still stands without maintenance. How many modern materials can match that?"

---

## Weekly Checklist

Copy this checklist for each week:

```
□ Collected 3-5 interesting links from Google Alerts
□ Identified a pattern or question connecting them
□ Copied template to blog/posts/YYYY-MM-DD.md
□ Updated date in frontmatter
□ Wrote ~300 words in 4 paragraphs
□ Added 3-5 sources at bottom
□ Read post aloud for flow
□ Ran: python3 generate_blog.py
□ Checked generated HTML in browser
□ Committed: git add + git commit
□ Pushed: git push
□ Verified post appears on rammedearth.in/updates.html
```

---

## Time Investment

**Weekly commitment:**
- 10-15 min: Collecting links (ongoing throughout week)
- 30-45 min: Writing post (focused session)
- 5-10 min: Generate, commit, push
- **Total: ~1 hour per week**

---

## SEO Benefits (Long-term)

### Month 1-2
- Google starts indexing new posts
- Crawl frequency increases

### Month 3-6
- Search traffic begins
- Long-tail keywords start ranking

### Month 6-12
- Established publishing rhythm
- Authority signals to Google
- Backlink potential increases

**Key:** Consistency matters more than perfection. Weekly publishing beats monthly "perfect" posts for SEO.

---

## Getting Unstuck

### "I can't find a pattern in this week's links"

**Solution:** Just pick the most interesting one and riff on it. Not every week needs to connect 5 sources. Sometimes one great observation is enough.

### "I'm over 300 words"

**Solution:** That's fine! 300 is a minimum, not a maximum. 400-500 words is perfectly acceptable if the content justifies it.

### "I missed a week"

**Solution:** Just resume. Don't apologize on the site. Consistency is the goal, but life happens. Pick up where you left off.

### "I don't know what to write about"

**Prompts:**
- What surprised you this week?
- What did you disagree with?
- What question keeps coming up?
- What technique are you testing?
- What mistake did you learn from?

---

## Quick Reference Commands

```bash
# Create new post
cp blog/TEMPLATE.md blog/posts/$(date +%Y-%m-%d).md

# Generate HTML
python3 generate_blog.py

# Commit and push
git add weekly-bites-*.html blog/posts/*.md updates.html
git commit -m "Weekly Bites: $(date +"%B %d, %Y")"
git push -u origin claude/continue-project-011CV4njhn2XzX2cNDpaiCtX
```

---

## Questions?

If something's unclear or not working:
1. Check the error message carefully
2. Review the Troubleshooting section above
3. Check blog/README.md for additional details
4. Look at existing posts in blog/posts/ as examples

---

**Remember:** Done is better than perfect. Publish consistently, learn from each post, and improve over time. The goal is to create value, not perfection.
