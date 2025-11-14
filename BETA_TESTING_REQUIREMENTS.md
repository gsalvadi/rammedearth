# Beta Testing Requirements - Soil Test PWA

## Objective

Validate that **builders and architects can complete soil tests with clear instructions** and successfully submit results.

---

## Beta Scale

**Testers:** 5-10 people
**Duration:** 2-3 weeks
**Type:** Private alpha/beta (closed testing)

---

## Success Criteria

### Primary Goals (Must Achieve)
1. ✅ **All testers complete at least 1 full test** (Visual → Ribbon → Ball → Preliminary Results)
2. ✅ **Instructions are clear** - No major confusion requiring hand-holding
3. ✅ **Camera works** - Photos captured successfully on various devices
4. ✅ **Results make sense** - Scores/recommendations appear reasonable to testers
5. ✅ **Submit button works** - All test data + photos successfully uploaded to backend

### Secondary Goals (Nice to Have)
- [ ] 3+ testers complete jar test (full 4-test flow)
- [ ] Test on at least 3 different device types (Android, iOS, desktop)
- [ ] Collect feedback on UI/UX improvements
- [ ] Validate preliminary algorithm accuracy

---

## What We're Testing

### Technical Validation
- [ ] PWA works on mobile browsers (Chrome Android, Safari iOS)
- [ ] Camera API works across devices
- [ ] Photo upload to Firebase succeeds
- [ ] IndexedDB storage works offline
- [ ] Results page displays correctly
- [ ] GPS location capture (with permission)

### UX Validation
- [ ] Instructions are understandable
- [ ] Photo guidelines are clear
- [ ] Form inputs make sense
- [ ] Two-stage results flow is intuitive
- [ ] Navigation is smooth
- [ ] No confusing error messages

### Algorithm Validation
- [ ] Preliminary results seem reasonable
- [ ] Recommendations are helpful
- [ ] Warnings make sense
- [ ] Score aligns with expectations

---

## Beta Tester Profile

**Target:** Builders, architects, or soil enthusiasts who:
- ✅ Have access to actual soil samples
- ✅ Own a smartphone (Android or iOS)
- ✅ Can spend 20-30 minutes testing
- ✅ Will provide honest feedback
- ✅ Are comfortable with "rough edges" (alpha quality)

**Ideal mix:**
- 3-4 professional builders (credibility/validation)
- 2-3 students/interns (usability feedback)
- 1-2 personal contacts (will tolerate bugs)

---

## Data Collection

### Automatically Collected (via Submit Button)
When tester clicks "Submit Test Results":

**Test Data:**
- All 4 test results (visual, ribbon, ball, jar if completed)
- Photos from each test
- Calculated scores and composition
- GPS location (if granted)
- Timestamp

**Metadata:**
- Device type (mobile/desktop)
- Browser (Chrome, Safari, etc.)
- Screen size
- Test duration (calculated from timestamps)

**User Info (optional):**
- Email/name (for follow-up)
- Anonymous ID (auto-generated)

### Manual Feedback Collection
Send follow-up form after submission:

**Feedback Questions:**
1. Which step was most confusing? (open text)
2. Did the results seem accurate? (Yes/No + comment)
3. Were photo guidelines clear? (1-5 scale)
4. How long did it take? (multiple choice)
5. Would you use this for real projects? (Yes/No/Maybe)
6. Any bugs or issues? (open text)
7. Suggestions for improvement? (open text)

---

## Beta Testing Process

### Phase 1: Recruitment (Week 1)
**Action:** Identify and contact 10-15 potential testers

**Outreach Email Template:**
```
Subject: Help test my soil testing app? (15-20 min)

Hi [Name],

I built a mobile app that guides you through field soil tests
for rammed earth. It's in private beta and I'd love your feedback.

What it does:
• 4 simple field tests (visual, ribbon, ball drop, jar)
• Photo-guided instructions
• Instant suitability score
• Works offline

What I need:
• 15-20 minutes of your time
• Access to a soil sample
• Honest feedback on clarity/usability

Interested? I'll send you the private link.

Thanks!
[Your name]
```

**Target:** Get 8-10 "yes" responses

---

### Phase 2: Onboarding (Week 1-2)
**Action:** Send testers the app link + brief instructions

**Onboarding Message:**
```
Thanks for testing! Here's what to do:

1. Open on your phone: [APP URL]
2. Complete at least the first 3 tests (15 min)
3. Click "Submit Test Results" when done
4. Fill out quick feedback form: [FORM LINK]

Tips:
• Use actual soil (not simulated)
• Take photos in good lighting
• Don't worry about perfection
• Report any bugs/confusion

Expected time: 20 minutes
Questions? Reply to this email.
```

---

### Phase 3: Testing & Support (Week 2-3)
**Action:** Monitor submissions, provide support

**Daily checklist:**
- [ ] Check Firebase for new submissions
- [ ] Review photos for quality/issues
- [ ] Respond to tester questions (same day)
- [ ] Document bugs in GitHub issues
- [ ] Track completion rate

**If stuck < 50% completion:**
- Follow up with non-completers
- Ask what's blocking them
- Simplify instructions
- Fix critical bugs

---

### Phase 4: Analysis (Week 3)
**Action:** Review all data and feedback

**Analysis checklist:**
- [ ] How many completed all tests? (target: 80%+)
- [ ] Average time to complete? (target: < 25 min)
- [ ] Photo quality acceptable? (target: 90%+ usable)
- [ ] Any recurring bugs? (fix before public launch)
- [ ] Algorithm accuracy? (compare prelim vs final scores)
- [ ] What needs to change?

---

## Required Materials for Testers

### What they need:
- ✅ Soil sample (dry, 1-2 cups)
- ✅ Smartphone with camera
- ✅ Water
- ✅ Clear jar with lid (for jar test)
- ✅ Ruler or tape measure
- ✅ White paper/surface (for visual test)
- ✅ 15-20 minutes

### What you provide:
- ✅ App link (private URL)
- ✅ Feedback form link
- ✅ Email support
- ✅ Clear instructions

---

## Metrics to Track

### Completion Metrics
```
Total testers invited:        10
Total started:                 ? (target: 8+)
Completed 3 tests:            ? (target: 6+)
Completed 4 tests:            ? (target: 3+)
Submitted results:            ? (target: 6+)
Completion rate:              ? (target: 60%+)
```

### Quality Metrics
```
Photos submitted:             ? (target: 24+, 4 per tester)
Usable photos:                ? (target: 90%+)
Average time:                 ? (target: < 25 min)
Feedback responses:           ? (target: 60%+)
```

### Issue Tracking
```
Critical bugs:                ? (target: 0)
Minor bugs:                   ? (acceptable: < 5)
Unclear instructions:         ? (target: 0 recurring)
Feature requests:             ? (document for later)
```

---

## Decision Points

### After 5 testers complete:
**If 80%+ success rate:**
→ Continue with current design
→ Invite next batch

**If < 50% success rate:**
→ STOP
→ Fix critical issues
→ Re-test with same testers

### After 10 tests collected:
**If feedback is positive:**
→ Fix minor bugs
→ Plan public beta launch

**If feedback is mixed:**
→ Major iteration needed
→ Extended beta period

---

## Post-Beta Deliverables

### For Review:
1. **Data Analysis Report**
   - Completion rates
   - Bug summary
   - User feedback themes
   - Algorithm accuracy

2. **Photo Gallery**
   - Best examples from each test
   - Range of soil types tested
   - Quality assessment

3. **Updated Roadmap**
   - Bugs to fix before launch
   - Feature requests prioritized
   - Timeline for public beta

---

## Risk Mitigation

### Risk: Low participation
**Mitigation:**
- Over-recruit (15 invites for 10 testers)
- Offer small incentive (credit on website)
- Make process super simple

### Risk: Technical failures
**Mitigation:**
- Test on own devices first
- Have 2-3 backup testers ready
- Provide email support channel

### Risk: Poor photo quality
**Mitigation:**
- Very clear photo guidelines
- Example photos in instructions
- Retake option always available

### Risk: Unclear instructions
**Mitigation:**
- Test with non-technical person first
- Iterate based on first 2 testers
- Provide help chat/email

---

## Timeline

```
Week 1:
Mon-Tue:   Finish Firebase backend
Wed:       Deploy app + test yourself
Thu:       Recruit testers (send 10 emails)
Fri:       Send app links to confirmed testers

Week 2:
Mon-Fri:   Testing period (support testers)
Sat-Sun:   Review submissions, fix bugs

Week 3:
Mon-Wed:   Collect remaining tests
Thu-Fri:   Analysis + decision on next steps
```

---

## Next Steps

1. ✅ Finish Firebase backend (see FIREBASE_BACKEND_PLAN.md)
2. ✅ Create feedback form (Google Forms)
3. ✅ Draft tester recruitment email
4. ✅ Deploy app to staging URL
5. ✅ Test end-to-end yourself
6. ✅ Send invites to 10 testers
7. ✅ Monitor and support

---

## Questions?

Contact: [Your email]
App repo: [Private - not shared during beta]
