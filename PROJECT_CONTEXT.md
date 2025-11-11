# The Rammed Earth Chronicles - Project Context

**Last Updated:** November 10, 2025
**Site URL:** https://rammedearth.in
**GitHub:** https://github.com/gsalvadi/rammedearth
**Substack:** https://rammedearth.substack.com/

---

## 🎯 PROJECT PURPOSE

A hub for earthen building enthusiasts and professionals. Created by Gokul, who built his own rammed earth house and now connects people through:
1. **Builder Directory** - Curated list of professionals worldwide
2. **Community Q&A** - Curated questions answered by professionals
3. **Personal Services** - Consultations, workshops, tech transfer

**Core Philosophy:** Gokul is the neutral curator/connector who learned the hard way and now helps others navigate earthen building.

---

## 👤 ABOUT GOKUL (The Curator)

- Built his own rammed earth house (lives in it)
- No formal credentials in soil mechanics or structural engineering
- Self-taught through testing, pauses, and mentorship
- Mentors: Satprem Maini (Auroville Earth Institute), David Easton, Julian Keable
- Approach: Realistic expectations, thorough soil testing (tests for a week), sensibility analysis
- Writing: The Rammed Earth Chronicles on Substack
- Philosophy: "Teaching and writing matter more than building"

**Positioning:** Dual role as practitioner (offers consultations) AND curator/connector (runs the hub). Not competing with directory members - different service model.

---

## 🏗️ SITE ARCHITECTURE

### **Phase 1: Pivot from Quiz to Hub** ✅ COMPLETE

**Originally:** Personal consultation quiz site
**Now:** Community hub with directory, Q&A, and personal services

### **Current Structure:**

#### **Main Page (index.html)**

**Navigation Tabs (in order):**
1. **About** ← Default/first tab
2. How It Works
3. Builder Directory
4. Community Q&A

**Key Sections Below Tabs:**
- Want to Learn to Build? (Consultation/Workshop/Tech Transfer forms)
- Three quiz forms with sophisticated filtering logic

#### **About Tab:**
- Explains the hub initiative
- Short bio about Gokul (condensed from story)
- Three buttons:
  - "Read the full story" → story.html
  - "Read the Chronicles" → Substack
  - "Work with me" → Opens consultation section
- Navigation text: "Looking for professionals in your area or have questions? See how it works →"

**Strategic Decision:** About tab is first to establish trust/credibility before services. Casual visitors need the story; action-oriented visitors will find their tab regardless.

---

## 📝 KEY FILES

### **Core Pages:**

1. **index.html** - Main hub page with tabs, forms, and quiz logic
2. **story.html** - Full narrative of Gokul's journey (from info.txt)
3. **directory.html** - Professional directory listings
4. **directory-entry-template.html** - Template for adding professionals

### **Community Q&A System (8 files):**

5. **ask-question.html** - Public question submission form
6. **qa-noticeboard.html** - Complete Q&A archive with filtering
7. **qa-curated.html** - Best-of selection page
8. **qa-entry-template.html** - Admin templates for publishing Q&As
9. **qa-email-templates.html** - 7 email templates for workflow
10. **qa-professional-guide.html** - Secret guide for professionals (not indexed)
11. **qa-workflow-documentation.html** - Complete 10-step workflow

### **Consultation Landing Pages (7 files):**

12. **consultation-conscious.html** - 60-100% score
13. **consultation-developing.html** - 40-59% score
14. **consultation-beginner.html** - 25-39% score
15. **consultation-theoretical.html** - 15-24% score
16. **consultation-not-ready.html** - 0-14% score
17. **consultation-cost-focused.html** - Red flag: budget focus
18. **consultation-wants-contractor.html** - Red flag: wants to hire

### **Other Landing Pages:**

19. **tech-transfer-received.html** - Tech transfer confirmation (inline response, no redirect yet)
20. **consultation-received.html** - Generic consultation confirmation

### **Documentation:**

21. **QUIZ_TEST_CASES.md** - Test cases for consultation quiz
22. **TECH_TRANSFER_LOGIC.md** - Complete breakdown of tech transfer quiz logic
23. **info.txt** - Gokul's full story (source for story.html)
24. **PROJECT_CONTEXT.md** - This file

### **Assets:**

25. **re.png** - Square logo (3105x3105, 849KB) for site header and Open Graph previews

---

## 🎨 DESIGN & BRANDING

**Color Palette:**
- Primary: #8B4513 (Saddle Brown)
- Accent: #D2691E (Chocolate)
- Background: #F5F2E8 (Warm cream)
- Highlights: Earth tones (terracotta, sand)

**Typography:**
- Font: Georgia, serif (warm, readable)
- Style: Clean, minimal, content-focused

**Visual Identity:**
- Square logo (re.png) on all pages
- Centered layout (max-width: 700-900px)
- Card-based design with subtle shadows
- Earth-tone borders and accents

---

## 🧮 QUIZ LOGIC SUMMARY

### **1. Consultation Quiz (4 questions, 20 points total)**

**Questions:**
1. What have you already tried to build?
2. Why do you want to build with rammed earth?
3. What's your primary hurdle?
4. What did the earth teach you when it failed? (conditional)

**Categories Scored:**
- Experience (0-5 pts)
- Motivation (0-5 pts)
- Self-Awareness (0-4 pts)
- Reflection (0-6 pts)

**Red Flags (immediate redirect):**
- Cost-focused language → consultation-cost-focused.html
- Wants contractor → consultation-wants-contractor.html

**Thresholds:**
- 60-100% = Conscious → consultation-conscious.html
- 40-59% = Developing → consultation-developing.html
- 25-39% = Beginner → consultation-beginner.html
- 15-24% = Theoretical → consultation-theoretical.html
- 0-14% = Not Ready → consultation-not-ready.html

**Details:** See QUIZ_TEST_CASES.md

### **2. Tech Transfer Quiz (4 questions, 20 points total)**

**Questions:**
1. Your role (dropdown)
2. Hands-on experience/willingness
3. Technology interests
4. Application plans

**Red Flags (immediate reject):**
- Role: contractor or representative
- One-off project language
- "Cheap" or "fast" focus
- Insufficient detail (<30 chars)
- Unwilling to engage hands-on

**Categories Scored:**
- Hands-On Willingness & Experience (0-8 pts)
- Technology Specificity (0-6 pts)
- Application Seriousness (0-6 pts)

**Thresholds:**
- 65-100% = Qualified Professional
- 45-64% = Developing Professional
- 30-44% = Willing Beginner Professional
- 0-29% = Not Qualified

**Current Response:** Inline text (not landing pages yet)

**Details:** See TECH_TRANSFER_LOGIC.md

### **3. Workshop Quiz (Simple form - not scored)**

Just collects interest for future workshops. No filtering logic.

---

## 📊 DATA FLOW

### **Form Submissions → Google Sheets**

All three forms submit to Google Sheets via Apps Script webhooks:

**Google Sheets:**
1. **Consultation Submissions** - Stores: timestamp, answers, email, country, level, score, flags
2. **Tech-Transfer Inquiries** - Stores: timestamp, role, answers, email, level, score, flags
3. **Workshop Interest** - Stores: timestamp, name, email, location, experience, interests
4. **Rammed Earth Question Submission** (Q&A) - Stores: timestamp, question, name, email

**Apps Script Structure:**
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([/* data fields */]);
  return ContentService.createTextOutput(JSON.stringify({'result': 'success'}));
}
```

Each form has its own Apps Script deployment with unique webhook URL.

---

## 🔄 COMMUNITY Q&A WORKFLOW

**10-Step Manual Process (1-2 hours/week):**

1. User submits question → Google Sheets
2. Review question (quality, clarity, scope)
3. Decide: Answer yourself OR forward to directory professional
4. If forwarding: Email professional using templates
5. Wait for response
6. Format Q&A entry using template
7. Publish to qa-noticeboard.html
8. Optional: Add to qa-curated.html if exceptional
9. Commit & push to GitHub
10. Notify asker via email from noreply@ (manual, pretending automated)

**Strategic Value:**
- Professionals answer publicly for SEO visibility (backlink to directory)
- Not helping competitors—marketing themselves
- Gokul is neutral connector making referrals
- Questions reveal Substack post themes

**Key Files:**
- qa-email-templates.html (7 templates for workflow)
- qa-entry-template.html (copy-paste HTML templates)
- qa-professional-guide.html (secret page explaining benefits)

---

## 🌐 OPEN GRAPH META TAGS

**Pages with OG tags:**
- ask-question.html
- qa-noticeboard.html
- qa-curated.html
- story.html
- index.html
- All consultation pages
- All weekly-bites pages
- Directory pages

**Standard OG tags used:**
```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://rammedearth.in/[page].html">
<meta property="og:title" content="[Page Title]">
<meta property="og:description" content="[Description]">
<meta property="og:image" content="https://rammedearth.in/re.png">
```

**Note:** Custom domain is rammedearth.in (configured in GitHub Pages settings via CNAME file)

---

## 🎯 STRATEGIC POSITIONING

### **The Positioning Problem (Solved):**

**Before:** Site didn't make clear Gokul offers consultations—looked like only a directory/Q&A hub.

**After:** About tab (now first) establishes:
1. Gokul is a practitioner (built his house)
2. Gokul offers consultations (realistic expectations, soil testing)
3. Why the hub exists (learned the hard way, wants to connect)
4. Clear differentiation: Directory vs. working with Gokul directly

### **Three User Paths:**

1. **Personal Engagement Path:**
   - "Read the full story" → story.html
   - "Read the Chronicles" → Substack subscription
   - Long-term relationship building

2. **Work with Gokul Path:**
   - "Work with me" button → Consultation form
   - Quiz filters readiness level
   - Appropriate landing page

3. **Use the Hub Path:**
   - "Looking for professionals..." link → How It Works tab
   - Choose: Directory, Q&A, or forms
   - Self-serve or curator-assisted

### **Why About Tab Is First:**

**User's reasoning (correct):**
> "A casual visitor is most likely to read the story or substack. People with particular intention would find the right tab."

**Analysis:**
- Motivated visitors (need builder NOW) will scan tabs and click Directory regardless
- Casual visitors need trust/credibility first → story establishes this
- Personal brand IS the differentiator (not just another directory)
- Story → Substack → Long-term relationship → Future consultations

---

## 📱 TECHNICAL NOTES

### **Static HTML Architecture:**
- No CMS, no database
- GitHub Pages hosting
- Manual content updates via git
- Google Sheets as backend for form submissions
- Apps Script webhooks for data collection

### **JavaScript Functionality:**
- Tab navigation (showInfoSection function)
- Form validation
- Quiz scoring logic (complex, see QUIZ_TEST_CASES.md)
- Dynamic content showing/hiding
- SessionStorage for passing data to landing pages

### **Mobile Responsive:**
- All pages use responsive design
- Flex layouts with flex-wrap
- Max-width constraints
- Readable font sizes
- Touch-friendly buttons

### **SEO Considerations:**
- Semantic HTML
- Meta descriptions on all pages
- Open Graph tags for social sharing
- Clean URLs
- Fast loading (static HTML)

---

## 🚧 PHASE 2 (Parked for Later)

### **Features Discussed but Not Implemented:**

1. **Consent checkbox** for directory professionals (future submissions)
2. **Auto-forwarding** features for referrals
3. **Referral tracking** system
4. **Multi-professional matching** logic
5. **Weekly Bites feature** (personal quotes, advice - not urgent)
6. **Content strategy refinement** (Substack research posts vs Weekly Bites)
7. **Google Alerts keyword strategy**
8. **Color scheme refinement** (sandy/bright red soil discussion deferred)
9. **Tech transfer landing pages** (like consultation has - currently inline response)
10. **Portfolio upload option** for professionals
11. **Certification tracking**
12. **Project scale detection** (residential vs commercial)

### **Q&A Enhancement Ideas:**

1. Eventually automate email notifications (currently manual)
2. Consider RSS feed for Q&A updates
3. Tag system expansion
4. Search improvements
5. User accounts (far future)

---

## 🔧 RECENT CHANGES (Nov 2025)

### **Session 1: Community Q&A System**
- Built complete Q&A system (8 files)
- Manual curation workflow
- Email templates for professionals
- Filtering and search functionality
- Strategic decision: Questions from anyone, answers only from directory OR Gokul

### **Session 2: Positioning & Story**
- Added Gokul's bio to About tab
- Created story.html with full narrative
- Established dual role (practitioner + curator)
- Fixed button styling inconsistencies
- Removed OG tag duplicates

### **Session 3: Navigation Flow**
- Moved About tab to first position
- Made About default on page load
- Added navigation text linking to How It Works
- Strategic decision validated: Trust before action

### **Known Issues:**
- Tech transfer quiz doesn't redirect to landing pages yet (uses inline response)
- Some button hover effects need refinement
- Image dimensions for OG previews could be optimized (currently 3105x3105)

---

## 📞 WORKING WITH GOKUL

**Contact Methods:**
1. **Consultation Form** - For building guidance
2. **Tech Transfer Form** - For professionals
3. **Workshop Form** - For group learning interest
4. **Q&A Submission** - For quick questions

**Email Setup:**
- Manual workflow pretends to be automated
- Uses noreply@ email for Q&A notifications
- All submissions go to Google Sheets first

**Geographic Coverage:**
- Consultations: Worldwide (remote)
- Workshops: [Location to be specified by Gokul]
- Directory: Global coverage

---

## 💡 KEY INSIGHTS FOR FUTURE DEVELOPMENT

### **What Works:**
- Manual curation maintains quality
- Quiz logic filters readiness effectively
- Personal story builds trust
- Professional SEO incentive (Q&A backlinks)
- Static HTML keeps things simple

### **What to Remember:**
- Gokul is neutral connector - professionals won't refer each other (competitors)
- Questions reveal Substack themes (strategic content mining)
- Setting realistic expectations is core value proposition
- Soil testing approach differentiates from others
- "Teaching and writing matter more than building" - this is the brand

### **User Psychology:**
- Casual visitors become Substack subscribers → future clients
- Action-oriented visitors just need quick path to services
- Professionals participate for SEO, not collaboration
- Quality over quantity in all aspects

---

## 🔑 IMPORTANT CONVENTIONS

### **Git Workflow:**
- Always use branches starting with `claude/`
- Branches must end with session ID
- Commit messages explain "why" not just "what"
- Pull before push (rebase if needed)

### **File Naming:**
- Kebab-case for HTML files
- UPPERCASE for documentation markdown
- Descriptive names preferred

### **Code Style:**
- Inline styles (no separate CSS file)
- Georgia serif font throughout
- Earth-tone color palette
- Comments for complex logic

### **Content Tone:**
- Honest, personal, experienced
- Humble but knowledgeable
- Practical over theoretical
- Story-driven

---

## 📚 REFERENCE DOCUMENTS

For detailed information, see:
- **QUIZ_TEST_CASES.md** - Consultation quiz scoring examples
- **TECH_TRANSFER_LOGIC.md** - Tech transfer quiz complete breakdown
- **info.txt** - Gokul's original story text
- **qa-workflow-documentation.html** - Q&A publishing process
- **qa-email-templates.html** - Communication templates

---

## 🎓 LEARNING FROM THIS PROJECT

**Key Takeaways:**
1. Personal brand + community hub = powerful combination
2. Manual curation scales better than expected (1-2 hrs/week)
3. Quiz logic can filter effectively without AI
4. Static HTML + Google Sheets = viable backend
5. Trust before action (About tab first) improves conversion
6. Story authenticity > professional credentials
7. Positioning clarity takes iteration

**What Made It Work:**
- Clear strategic vision from Gokul
- Iterative refinement based on UX principles
- Understanding user psychology
- Balancing personal brand with hub utility
- Not over-engineering (static HTML, manual workflow)

---

**END OF PROJECT CONTEXT**

*Last updated: November 10, 2025*
*Next session: Use this file to understand the complete project state*
