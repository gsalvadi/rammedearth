# Soil Assessment Scoring Logic

**Purpose**: This document explains how the app calculates suitability scores for rammed earth construction, making it easy to understand and adjust the scoring system.

**Version**: 1.0-beta
**Last Updated**: 2025-11-14

---

## Overview

The app assigns a score from **0 to 100** based on soil test results. The score determines if soil is:
- **Excellent** (85+ points) - Ready to use with minimal intervention
- **Suitable** (70-84 points) - Good with minor adjustments
- **Marginal** (50-69 points) - Needs modification
- **Unsuitable** (<50 points) - Major changes required

There are **two different scoring systems**:
1. **Final Score** - Uses precise jar test data (100% confidence)
2. **Preliminary Score** - Estimates from field observations only (65% confidence)

---

## Final Scoring (With Jar Test) - Maximum 100 Points

### Point Distribution

| Test Component | Points Available | What It Measures |
|---|---|---|
| Sand Content | 35 points | Structural strength, drainage |
| Clay Content | 35 points | Binding power |
| Ribbon Test | 15 points | Clay plasticity |
| Ball Drop Test | 15 points | Cohesion & moisture |
| **TOTAL** | **100 points** | |

### Detailed Scoring Breakdown

#### 1. Sand Content (35 points max)
**Ideal Range**: 50-75%

| Sand Percentage | Points Awarded | Status |
|---|---|---|
| 50-75% | **35 points** | ✓ Excellent |
| 40-49% | **25 points** | ⚠ Slightly low |
| 76-85% | **25 points** | ⚠ Slightly high |
| <40% or >85% | **10 points** | ✗ Out of range |

**Why it matters**: Sand provides structure and prevents excessive shrinkage. Too little = weak walls. Too much = poor binding.

---

#### 2. Clay Content (35 points max)
**Ideal Range**: 10-20%

| Clay Percentage | Points Awarded | Status |
|---|---|---|
| 10-20% | **35 points** | ✓ Excellent |
| 8-9% | **25 points** | ⚠ Add clay or cement |
| 21-30% | **20 points** | ⚠ Add sand or cement |
| <8% | **10 points** | ✗ Stabilization required |
| >30% | **10 points** | ✗ Major modification needed |

**Why it matters**: Clay is the "glue" that binds soil particles. Too little = crumbles. Too much = cracks during drying.

---

#### 3. Ribbon Test (15 points max)
**Ideal Range**: 50-100mm ribbon length

| Ribbon Length | Points Awarded | Status |
|---|---|---|
| 50-100mm | **15 points** | ✓ Perfect clay content |
| 25-49mm | **10 points** | ⚠ Moderate clay |
| 101-150mm | **8 points** | ⚠ High plasticity |
| <25mm | **5 points** | ✗ Low clay |
| >150mm | **5 points** | ✗ Very high clay |

**Why it matters**: Confirms clay content observed in jar test. Longer ribbon = more clay.

---

#### 4. Ball Drop Test (15 points max)
**Ideal Result**: Ball cracks but doesn't shatter

| Ball Drop Result | Points Awarded | Status |
|---|---|---|
| Cracks, stays intact | **15 points** | ✓ Optimal moisture & cohesion |
| Stays completely intact | **10 points** | ⚠ Possibly too much moisture/clay |
| Shatters completely | **5 points** | ✗ Too dry or low clay |
| Splatters/deforms | **5 points** | ✗ Too wet |

**Why it matters**: Tests how soil behaves under impact (similar to ramming). Ideal soil cracks slightly but holds shape.

---

### Final Score Categories

| Score Range | Category | Rating | Typical Action |
|---|---|---|---|
| **85-100** | Excellent | ✓✓✓ | Use as-is, minimal stabilizer |
| **70-84** | Suitable | ✓✓ | Minor adjustments, 0-5% cement |
| **50-69** | Marginal | ⚠ | Requires stabilization (5-12% cement) |
| **0-49** | Unsuitable | ✗ | Major modification or source new soil |

---

## Preliminary Scoring (No Jar Test) - Maximum ~70 Points

**Important**: Preliminary scores are intentionally lower because they're based on estimates, not precise measurements.

### Point Distribution

| Test Component | Points Available | What It Measures |
|---|---|---|
| Ribbon Test | 25 points | Clay estimate |
| Ball Drop Test | 20 points | Cohesion |
| Visual/Texture Estimate | 20 points | Composition guess |
| Organic Matter | +5 or -10 points | Contamination |
| **REALISTIC MAX** | **~65-70 points** | |

### Why Preliminary Scores Are Lower

**Problem**: A sample that would score 85+ in final testing might only score 60-65 in preliminary testing.

**Reason**: Without jar test data, the app can only estimate composition. It awards fewer points for estimates than for precise measurements.

### Detailed Preliminary Scoring

#### 1. Ribbon Test (25 points max)

| Ribbon Length | Points Awarded | Estimated Clay |
|---|---|---|
| 50-100mm | **25 points** | 15-20% (ideal) |
| 25-49mm | **15 points** | 10-15% (moderate) |
| >100mm | **15 points** | 20%+ (high) |
| <25mm | **15 points** | <10% (low) |

**Note**: Even perfect ribbon (50-100mm) only gets 25 points here vs 15 points in final (because it's being used to estimate composition too).

---

#### 2. Ball Drop Test (20 points max)

| Ball Drop Result | Points Awarded |
|---|---|
| Cracks, stays intact | **20 points** |
| Stays completely intact | **15 points** |
| Shatters OR splatters | **10 points** |

**Note**: Gets more weight in preliminary because it's a key cohesion indicator.

---

#### 3. Visual/Texture Estimate (20 points max)

Based on estimated composition from visual assessment and ribbon test:

| Estimated Composition | Points Awarded |
|---|---|
| Sand 50-75%, Clay 10-20% | **20 points** |
| Sand 40-85% (broader range) | **10 points** |
| Outside ranges | **5 points** |

**How it estimates**:

**Visual texture** provides initial guess:
- Coarse → 70% sand, 10% clay
- Smooth → 40% sand, 20% clay
- Sticky → 35% sand, 35% clay

**Ribbon test** refines estimate:
- <25mm ribbon → Reduce clay by 10%, increase sand
- 50-100mm ribbon → Keep estimate
- >100mm ribbon → Increase clay by 15%, reduce sand

---

#### 4. Organic Matter (-10 to +5 points)

| Organic Matter Level | Points |
|---|---|
| Minimal/None | **+5 points** |
| Medium | **0 points** (warning added) |
| High | **-10 points** (severe penalty) |

---

### Preliminary Score Categories

| Score Range | Category | Rating |
|---|---|---|
| **60+** | Suitable | ✓ (Lower threshold than final!) |
| **40-59** | Marginal | ⚠ |
| **0-39** | Unsuitable | ✗ |

**Key Difference**: "Suitable" threshold is **60 points** (vs 70 for final) because preliminary scores max out lower.

---

## The Scoring Problem: Why Good Soil Scores Only 65%

### Example: Very Suitable Soil

**Actual Composition** (would score 85+ with jar test):
- Sand: 65% ✓
- Silt: 20% ✓
- Clay: 15% ✓

**Preliminary Test Results**:
- Visual texture: Slightly coarse
- Ribbon length: 75mm (perfect!)
- Ball drop: Cracks but intact (perfect!)
- Organic matter: Minimal

**Preliminary Score Calculation**:

| Component | Points Earned | Max Possible |
|---|---|---|
| Ribbon test (75mm) | 25 | 25 |
| Ball drop (cracked) | 20 | 20 |
| Visual estimate | 20 | 20 |
| Organic matter (minimal) | +5 | +5 |
| **TOTAL** | **70** | **70** |

**Final Category**: "Suitable" (60+ points)

**If jar test completed** (same soil):

| Component | Points Earned | Max Possible |
|---|---|---|
| Sand 65% (ideal) | 35 | 35 |
| Clay 15% (ideal) | 35 | 35 |
| Ribbon 75mm (ideal) | 15 | 15 |
| Ball drop (cracked) | 15 | 15 |
| **TOTAL** | **100** | **100** |

**Final Category**: "Excellent" (85+ points)

### The Gap: 70 vs 100 Points for Same Soil!

---

## How to Adjust Scoring

### Option 1: Increase Preliminary Maximum (Recommended)

**Current Issue**: Preliminary max is ~70, but "Excellent" threshold is 85.

**Solution**: Award more points for strong preliminary indicators.

#### Adjustments to Make:

**File**: `soil-test/js/test-logic.js` (lines 137-267)

**Change 1**: Increase ribbon test points (Line 164-182)
```
Current:
- Perfect ribbon (50-100mm): +25 points

Increase to:
- Perfect ribbon (50-100mm): +35 points
```

**Change 2**: Increase ball drop points (Line 184-204)
```
Current:
- Perfect ball drop: +20 points

Increase to:
- Perfect ball drop: +25 points
```

**Change 3**: Increase composition estimate bonus (Line 213-220)
```
Current:
- Ideal estimated composition: +20 points

Increase to:
- Ideal estimated composition: +30 points
```

**New Preliminary Maximum**: ~95 points
**Now truly excellent soil can score 85+ even in preliminary!**

---

### Option 2: Lower "Excellent" Threshold for Preliminary

**Current Issue**: Same "Excellent" threshold (85) for both preliminary and final.

**Solution**: Use different thresholds for preliminary results.

#### Adjustments to Make:

**File**: `soil-test/js/test-logic.js` (lines 236-244)

**Current Code**:
```
if (score >= 60) {
  category = 'suitable';
} else if (score >= 40) {
  category = 'marginal';
} else {
  category = 'unsuitable';
}
```

**Change to**:
```
if (score >= 65) {
  category = 'excellent';     // NEW CATEGORY
} else if (score >= 50) {
  category = 'suitable';
} else if (score >= 35) {
  category = 'marginal';
} else {
  category = 'unsuitable';
}
```

**Now**: A soil scoring 70 in preliminary gets "Excellent" rating.

---

### Option 3: Hybrid Approach (Best)

Combine both approaches:

1. **Increase preliminary points** to max ~85-90
2. **Add "excellent" category** for preliminary at 75+
3. **Keep final thresholds** at 85+ for excellent

This way:
- Truly excellent soil scores 75-85 preliminary → "Excellent (Preliminary)"
- Same soil scores 95-100 final → "Excellent (Confirmed)"
- Users see consistent quality assessment

---

## Recommended Changes

### Quick Fix (5 minutes)

**File**: `soil-test/js/test-logic.js`

**Line 164-182** (Ribbon test in preliminary):
```javascript
// BEFORE:
if (ribbonLength >= 25 && ribbonLength <= 100) {
  score += 25;  // CHANGE THIS TO 35
}

// AFTER:
if (ribbonLength >= 25 && ribbonLength <= 100) {
  score += 35;  // Increased from 25
}
```

**Line 187-190** (Ball drop in preliminary):
```javascript
// BEFORE:
if (ballDrop === 'cracked_not_shattered') {
  score += 20;  // CHANGE THIS TO 25

// AFTER:
if (ballDrop === 'cracked_not_shattered') {
  score += 25;  // Increased from 20
```

**Line 213-214** (Composition estimate):
```javascript
// BEFORE:
if (estimatedSand >= 50 && estimatedSand <= 75 && estimatedClay >= 10 && estimatedClay <= 20) {
  score += 20;  // CHANGE THIS TO 30

// AFTER:
if (estimatedSand >= 50 && estimatedSand <= 75 && estimatedClay >= 10 && estimatedClay <= 20) {
  score += 30;  // Increased from 20
```

**Line 236-244** (Add excellent category):
```javascript
// BEFORE:
let category;
if (score >= 60) {
  category = 'suitable';
} else if (score >= 40) {
  category = 'marginal';
} else {
  category = 'unsuitable';
}

// AFTER:
let category;
if (score >= 75) {
  category = 'excellent';  // NEW!
} else if (score >= 55) {
  category = 'suitable';
} else if (score >= 35) {
  category = 'marginal';
} else {
  category = 'unsuitable';
}
```

### Result of Changes

**Before**:
- Perfect preliminary score: ~70 points → "Suitable"
- Excellent soil appears only "Suitable" until jar test

**After**:
- Perfect preliminary score: ~95 points → "Excellent"
- Excellent soil recognized immediately
- Confidence message makes clear it's preliminary

**Example Scores**:

| Soil Quality | Old Prelim | New Prelim | Final |
|---|---|---|---|
| Excellent | 65 (Suitable) | 90 (Excellent) | 100 (Excellent) |
| Good | 55 (Suitable) | 70 (Suitable) | 80 (Suitable) |
| Marginal | 45 (Marginal) | 50 (Marginal) | 60 (Marginal) |
| Poor | 30 (Unsuitable) | 30 (Unsuitable) | 40 (Unsuitable) |

---

## Testing Your Changes

After making changes:

1. **Complete a test** with known excellent soil:
   - Ribbon: 75mm
   - Ball drop: Cracked but intact
   - Texture: Slightly coarse
   - Organic matter: Minimal

2. **Check preliminary score**:
   - Should now be 85-90 points
   - Should show "Excellent" category

3. **Complete jar test** (if available):
   - Should score 95-100 points
   - Should confirm "Excellent"

4. **Test with marginal soil**:
   - Should still score 40-55 points
   - Make sure thresholds still distinguish quality

---

## Summary Table: Current vs Recommended

| Aspect | Current System | Recommended System |
|---|---|---|
| **Preliminary Max** | ~70 points | ~95 points |
| **Excellent Threshold (Prelim)** | N/A (no excellent) | 75+ points |
| **Suitable Threshold (Prelim)** | 60+ points | 55+ points |
| **Preliminary Perfect Score** | 70 ("Suitable") | 90 ("Excellent") |
| **Same soil in Final** | 100 ("Excellent") | 100 ("Excellent") |
| **Consistency** | ❌ (70 vs 100 gap) | ✅ (90 vs 100 aligned) |

---

## Questions to Consider

Before adjusting scores, ask:

1. **What should "Excellent" preliminary mean?**
   - All field tests perfect?
   - Strong confidence soil is ideal?

2. **What's the risk of false positives?**
   - Could poor soil score high in preliminary?
   - Jar test will correct this anyway

3. **What message to users?**
   - "Preliminary Excellent" vs "Confirmed Excellent"?
   - Both show confidence level (65% vs 100%)

4. **Beta testing feedback?**
   - Have testers compare preliminary vs final scores
   - Adjust based on real soil data

---

## File to Edit

**Location**: `soil-test/js/test-logic.js`

**Lines to modify**:
- 164-182: Ribbon test scoring
- 187-204: Ball drop scoring
- 213-220: Composition estimate scoring
- 236-244: Category thresholds

**After editing**: Test in browser, no build step needed (vanilla JavaScript).

---

**Last Updated**: 2025-11-14
**Document Version**: 1.0
