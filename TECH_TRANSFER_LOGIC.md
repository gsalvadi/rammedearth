# Tech Transfer Quiz - Complete Logic Breakdown

**Location**: `index.html:945-1173`
**Function**: `analyzeTechTransfer(answers)`
**Total Possible Points**: 20 (across 3 categories)

---

## QUIZ STRUCTURE

The tech transfer quiz evaluates professionals across **4 questions**:

1. **Role**: Dropdown selection (architect/engineer/builder/contractor/representative/other)
2. **Hands-On Experience/Willingness**: Textarea (describes past experience OR future willingness)
3. **Technology**: Textarea (specific technical areas they want to learn)
4. **Application**: Textarea (how they'll use the knowledge)

---

## PHASE 1: IMMEDIATE DISQUALIFICATION (Red Flags)

These bypass all scoring and redirect immediately to the directory:

### **1. ROLE-BASED REJECTION** (`index.html:951-954`)

```javascript
IF role === 'contractor' OR role === 'representative'
  → REJECT: 'redirect-to-directory'
  → Reasoning: "Role indicates seeking contractors, not knowledge transfer"
```

**Why**: Contractors/representatives are looking for subcontractors, not learning

---

### **2. ONE-OFF PROJECT DETECTION** (`index.html:956-960`)

```javascript
quickProjectPhrases = ['one project', 'single project', 'one-time',
                       'quick turnaround', 'urgent']

IF ANY phrase found in application.toLowerCase()
  → REJECT: 'redirect-to-directory'
  → Reasoning: "Application indicates one-off project, not long-term capability building"
```

**Why**: Tech transfer is for building long-term capacity, not one-time projects

---

### **3. SPEED/COST FOCUS** (`index.html:962-965`)

```javascript
IF technology.toLowerCase() contains 'cheap' OR 'fast'
  → REJECT: 'redirect-to-directory'
  → Reasoning: "Focus on speed/cost rather than knowledge depth"
```

**Why**: Knowledge transfer takes time and investment - incompatible with quick/cheap mentality

---

### **4. INSUFFICIENT DETAIL** (`index.html:972-975`)

```javascript
IF handsOn.length < 30 characters
  → REJECT: 'no-hands-on-response'
  → Reasoning: "Insufficient detail about hands-on involvement"
```

**Why**: Can't assess readiness with minimal information

---

### **5. UNWILLINGNESS TO ENGAGE HANDS-ON** (`index.html:977-987`)

**Phase A - Direct Unwillingness Phrases**:
```javascript
unwillingPhrases = ['no time for', 'too busy to', 'will delegate',
                    'my team will handle', 'others will do',
                    'supervise only', 'design only']

IF ANY phrase found in handsOn.toLowerCase()
  → REJECT: 'unwilling-hands-on'
```

**Phase B - Contextual Unwillingness**:
```javascript
unwillingWords = ['delegate', 'supervise']

IF contextualMatch(handsOn, unwillingWords) >= 1
  AND handsOn does NOT contain 'but' or 'however'
  → REJECT: 'unwilling-hands-on'
  → Reasoning: "Indicates unwillingness for hands-on engagement"
```

**Exception**: If they use "but" or "however" after unwilling words, it suggests they're contrasting (e.g., "I usually delegate BUT I'm willing to learn myself")

---

## PHASE 2: SCORED CATEGORIES (20 Total Points)

If no red flags triggered, scoring begins:

---

## CATEGORY 1: HANDS-ON WILLINGNESS & EXPERIENCE (0-8 points)

**Location**: `index.html:993-1052`

### **Subcategory A: Willingness Markers (0-2 pts)**

```javascript
willingPhrases = ['willing to', 'ready to get', 'want to learn',
                  'eager to', 'committed to']
willingWords = ['willing', 'ready', 'hands-on', 'personally',
                'myself', 'learn by doing']

phraseMatches = count(willingPhrases in handsOn)
wordMatches = count(contextualMatch(handsOn, willingWords))

IF phraseMatches >= 1 OR wordMatches >= 2 → +2 points
ELSE IF wordMatches >= 1 → +1 point
```

**What it measures**: Explicit commitment to hands-on learning

---

### **Subcategory B: Material Experience (0-2 pts)**

```javascript
materials = ['clay', 'mud', 'concrete', 'earth', 'soil', 'mortar', 'plaster']
mentions = count(materials in handsOn.toLowerCase())

IF mentions >= 2 → +2 points
ELSE IF mentions >= 1 → +1 point
```

**What it measures**: Past experience with building materials

---

### **Subcategory C: Technical Experience (0-2 pts)**

```javascript
technicalTerms = ['mix', 'ratio', 'water', 'compression', 'formwork', 'testing']
mentions = count(technicalTerms in handsOn.toLowerCase())

IF mentions >= 2 → +2 points
ELSE IF mentions >= 1 → +1 point
```

**What it measures**: Technical understanding of construction processes

---

### **Subcategory D: Tactile/Learning Language (0-2 pts)**

```javascript
tactileWords = ['hands', 'touch', 'feel', 'experience']
learningWords = ['fail', 'mistake', 'learn', 'understand']

IF ANY tactileWord in handsOn → +1 point
IF ANY learningWord in handsOn → +1 point
```

**What it measures**: Embodied learning orientation

---

### **Subcategory E: Specificity Bonus (0-1 pt)**

```javascript
IF hasSpecifics(handsOn) AND sentenceCount >= 3 → +1 point
```

**What it measures**: Detailed, thoughtful responses

**Category Max: 8 points**

---

## CATEGORY 2: TECHNOLOGY SPECIFICITY (0-6 points)

**Location**: `index.html:1054-1088`

### **Subcategory A: Technical Breadth (0-3 pts)**

```javascript
techAreas = ['mix design', 'soil testing', 'formwork',
             'construction sequence', 'compression', 'moisture',
             'curing', 'stabilization']
mentions = count(techAreas in technology.toLowerCase())

IF mentions >= 3 → +3 points
ELSE IF mentions >= 2 → +2 points
ELSE IF mentions >= 1 → +1 point
```

**What it measures**: Specific technical areas of interest

---

### **Subcategory B: Specific Questions (0-1 pt)**

```javascript
IF technology matches: /how to|how do|what is|understanding|learn about/i
  → +1 point
```

**What it measures**: Inquiry-based learning mindset

---

### **Subcategory C: Length & Detail (0-2 pts)**

```javascript
IF sentenceCount >= 3 AND length > 100 → +2 points
ELSE IF length > 60 → +1 point
```

**What it measures**: Depth of technical thinking

**Category Max: 6 points**

---

## CATEGORY 3: APPLICATION SERIOUSNESS (0-6 points)

**Location**: `index.html:1090-1127`

### **Subcategory A: Long-Term Commitment (0-3 pts)**

```javascript
longTermWords = ['practice', 'ongoing', 'long-term', 'capability',
                 'building', 'develop', 'integrate']
matches = count(contextualMatch(application, longTermWords))

IF matches >= 3 → +3 points
ELSE IF matches >= 2 → +2 points
ELSE IF matches >= 1 → +1 point
```

**What it measures**: Commitment to sustained practice development

---

### **Subcategory B: Organizational Context (0-1 pt)**

```javascript
IF application matches: /team|staff|organization|company|practice/i
  → +1 point
```

**What it measures**: Professional/organizational framework

---

### **Subcategory C: Professional Growth (0-1 pt)**

```javascript
IF application matches: /skill|knowledge|capability|expertise|competence/i
  → +1 point
```

**What it measures**: Capacity-building mindset

---

### **Subcategory D: Specificity (0-1 pt)**

```javascript
IF hasSpecifics(application) AND sentenceCount >= 2 → +1 point
```

**What it measures**: Concrete application plans

**Category Max: 6 points**

---

## PERCENTAGE CALCULATION

```javascript
totalScore = handsOnScore + techScore + appScore
maxScore = 20 points
percentScore = (totalScore / maxScore) * 100

// Also creates breakdown
breakdown = {
  handsOn: `${handsOnScore}/8`,
  technology: `${techScore}/6`,
  application: `${appScore}/6`
}
```

---

## CLASSIFICATION THRESHOLDS

### **QUALIFIED-PROFESSIONAL** (65-100%)

```javascript
IF percentScore >= 65
  → Level: 'qualified-professional'
  → Reasoning: "Strong professional readiness - hands-on commitment,
                technical specificity, and long-term vision"
```

**Score Range**: 13-20 points
**Profile**: Ready for tech transfer now
**Next Step**: Contact within 1 week to discuss

**Example Breakdown**:
- Hands-On: 6/8 (willingness + materials + technical)
- Technology: 5/6 (broad knowledge + specific questions)
- Application: 4/6 (long-term + organizational + growth)
- **Total: 15/20 = 75%**

---

### **DEVELOPING-PROFESSIONAL** (45-64%)

```javascript
IF percentScore >= 45 AND < 65
  → Level: 'developing-professional'
  → Reasoning: "Genuine professional interest with room to strengthen
                commitment or specificity"
```

**Score Range**: 9-12.9 points
**Profile**: Good foundation, needs strengthening
**Next Step**: Additional hands-on experience, then return

**Example Breakdown**:
- Hands-On: 4/8 (some willingness, limited experience)
- Technology: 3/6 (some specificity)
- Application: 3/6 (moderate commitment)
- **Total: 10/20 = 50%**

---

### **WILLING-BEGINNER-PROFESSIONAL** (30-44%)

```javascript
IF percentScore >= 30 AND < 45
  → Level: 'willing-beginner-professional'
  → Reasoning: "Shows willingness but needs more hands-on foundation
                or technical clarity"
```

**Score Range**: 6-8.9 points
**Profile**: Willing but inexperienced
**Next Step**: Foundation building, workshops, then return

**Example Breakdown**:
- Hands-On: 3/8 (willingness but no experience)
- Technology: 2/6 (vague interests)
- Application: 2/6 (unclear plans)
- **Total: 7/20 = 35%**

---

### **NOT-QUALIFIED** (0-29%)

```javascript
IF percentScore < 30
  → Level: 'not-qualified'
  → Reasoning: "Insufficient readiness for professional knowledge
                transfer at this time"
```

**Score Range**: 0-5.9 points
**Profile**: Not ready for tech transfer
**Next Step**: Consider consultation track or defer

**Example Breakdown**:
- Hands-On: 1/8 (minimal)
- Technology: 1/6 (vague)
- Application: 1/6 (unclear)
- **Total: 3/20 = 15%**

---

## HUMAN REVIEW FLAGS

### **Borderline Score Flag** (`index.html:1157-1159`)

```javascript
IF percentScore >= 40 AND percentScore <= 50
  → Flag: "BORDERLINE - Recommend human review"
```

**Why**: Scores between developing and willing-beginner need judgment call

---

### **Low Category Flags** (`index.html:1162-1170`)

```javascript
IF handsOnScore <= 2
  → Flag: "LOW hands-on score - may need more practical engagement"

IF techScore <= 1
  → Flag: "LOW technical specificity - unclear what they want to learn"

IF appScore <= 1
  → Flag: "LOW application clarity - unclear how knowledge will be used"
```

**Why**: Even if total score passes, weak individual categories are concerning

---

## RESPONSE GENERATION

Tech transfer responses are NOT yet redirected to landing pages (unlike consultation). They still use inline display.

**Location**: `index.html:1207-1280` (generateTechResponse function exists but not shown in previous read)

---

## COMPARISON: CONSULTATION vs TECH TRANSFER

| Feature | Consultation Quiz | Tech Transfer Quiz |
|---------|------------------|-------------------|
| **Questions** | 4 questions | 4 questions |
| **Total Points** | 20 | 20 |
| **Categories** | 4 (Experience, Motivation, Self-Awareness, Reflection) | 3 (Hands-On, Technology, Application) |
| **Red Flags** | 2 (cost-focused, wants-contractor) | 5 (role, one-off, cheap/fast, no detail, unwilling) |
| **Thresholds** | 60%, 40%, 25%, 15% | 65%, 45%, 30% |
| **Levels** | 5 (conscious, developing, beginner, theoretical, not-ready) | 4 (qualified, developing, willing-beginner, not-qualified) |
| **Borderline Range** | 35-45% | 40-50% |
| **Landing Pages** | ✅ Implemented | ❌ Not implemented yet |
| **Context Checks** | Yes (negation detection) | Yes (negation + exception words) |

---

## KEY DESIGN DIFFERENCES

### **1. Higher Bar for Tech Transfer**
- Qualified threshold: **65%** vs Consultation's **60%**
- Reflects higher expectations for professionals

### **2. More Red Flag Checks**
- Tech transfer has 5 rejection paths vs consultation's 2
- Screens out contractors, one-off projects, unwilling learners

### **3. Emphasis on Willingness Over Experience**
- "Willing beginner professional" is a valid category
- Willingness to learn hands-on counts as much as past experience
- Recognizes professionals can learn quickly if committed

### **4. Organizational Context Matters**
- Checks for team/company/practice language
- Values knowledge transfer that benefits organizations

### **5. Specificity Required**
- Technology answer must mention specific areas (formwork, soil testing, etc.)
- Application must show concrete plans
- Vague responses score poorly

---

## EDGE CASES & NUANCES

### **Exception for "But" and "However"** (`index.html:984`)

```javascript
// This REJECTS:
"I usually delegate to my team"

// This PASSES:
"I usually delegate BUT I'm ready to learn myself for this project"
```

**Why**: Contrasting words indicate awareness and willingness to change behavior

---

### **Willingness = Experience**

A professional with no earth building experience can score well if they show:
- Strong willingness markers (+2)
- Tactile/learning language (+2)
- Specificity about plans (+1)
- Long-term commitment (+3)
- **= 8+ points possible without past experience**

---

### **Length Requirements**

```javascript
// Minimum lengths to avoid rejection:
handsOn: >= 30 characters (or immediate reject)
technology: >= 60 recommended (for scoring)
application: no hard minimum (but <60 scores 0 for detail)
```

---

## DEBUG DATA STRUCTURE

When quiz completes, returns:

```javascript
{
  level: "developing-professional",
  debug: {
    scores: {
      willingness: 2,
      materialExperience: 1,
      technicalExperience: 2,
      tactileAwareness: 1,
      learningOrientation: 1,
      handsOnDetail: 1,
      technicalBreadth: 2,
      specificQuestions: 1,
      technicalDetail: 1,
      longTermCommitment: 2,
      organizationalContext: 1,
      professionalGrowth: 1,
      applicationDetail: 1
    },
    flags: [
      "BORDERLINE - Recommend human review",
      "LOW technical specificity - unclear what they want to learn"
    ],
    reasoning: [
      "Genuine professional interest with room to strengthen commitment or specificity"
    ],
    totalScore: "10.0",
    maxScore: 20,
    percentScore: "50.0",
    breakdown: {
      handsOn: "8/8",
      technology: "4/6",
      application: "4/6"
    }
  }
}
```

---

## GOOGLE SHEETS DATA CAPTURE

Tech transfer submissions send:

```javascript
{
  email: "user@example.com",
  role: "architect",
  handsOn: "full answer text...",
  technology: "full answer text...",
  application: "full answer text...",
  level: "developing-professional",
  score: "50.0",
  breakdown: '{"handsOn":"8/8","technology":"4/6","application":"4/6"}',
  flags: "BORDERLINE - Recommend human review; LOW technical specificity",
  reasoning: "Genuine professional interest with room to strengthen..."
}
```

---

## RECOMMENDATIONS FOR IMPROVEMENT

Based on the logic analysis, potential enhancements:

1. **Add Tech Transfer Landing Pages** (like consultation has)
2. **Expand Technical Area Keywords** (e.g., add "thermal mass", "structural design", "building codes")
3. **Industry-Specific Paths** (different thresholds for architects vs engineers vs builders)
4. **Portfolio Upload Option** (for showcasing past work)
5. **Certification Tracking** (if they have relevant credentials)
6. **Project Scale Detection** (residential vs commercial vs institutional)

---

**END OF TECH TRANSFER LOGIC BREAKDOWN**
