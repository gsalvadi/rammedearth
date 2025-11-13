/**
 * Test Logic Module - Suitability algorithm and result calculation
 */

class TestLogic {
  /**
   * Calculate suitability score based on test results
   */
  calculateSuitability(testData, isPreliminary = false) {
    let score = 0;
    const warnings = [];
    const recommendations = [];
    let confidenceLevel = 100;

    // Check if we have jar test data
    const hasJarTest = testData.tests && testData.tests.jarTest &&
      (testData.tests.jarTest.sandPct || testData.tests.jarTest.sandHeight);

    // If no jar test data, calculate preliminary results
    if (!hasJarTest) {
      return this.calculatePreliminarySuitability(testData);
    }

    // Calculate percentages from jar test if not already calculated
    const jarTest = testData.tests.jarTest;
    if (!jarTest.sandPct || !jarTest.siltPct || !jarTest.clayPct) {
      this.calculateJarTestPercentages(jarTest);
    }

    // SAND EVALUATION (ideal: 50-75%) - 35 points max
    const sand = jarTest.sandPct;
    if (sand >= 50 && sand <= 75) {
      score += 35; // Excellent
    } else if (sand >= 40 && sand < 50) {
      score += 25;
      warnings.push('Sand content slightly low - may affect drainage');
    } else if (sand > 75 && sand <= 85) {
      score += 25;
      warnings.push('High sand content - may need more clay for binding');
    } else {
      score += 10;
      warnings.push('Sand content significantly out of optimal range');
    }

    // CLAY EVALUATION (ideal: 10-20%) - 35 points max
    const clay = jarTest.clayPct;
    if (clay >= 10 && clay <= 20) {
      score += 35; // Excellent
    } else if (clay >= 8 && clay < 10) {
      score += 25;
      recommendations.push('Consider adding clay or 5-8% cement stabilizer');
    } else if (clay > 20 && clay <= 30) {
      score += 20;
      recommendations.push('High clay content - add sand or 8-10% cement to prevent cracking');
    } else if (clay < 8) {
      score += 10;
      warnings.push('Low clay content - stabilization required');
      recommendations.push('Add 8-12% cement or lime stabilizer');
    } else {
      score += 10;
      warnings.push('Very high clay content - significant modification needed');
      recommendations.push('Add coarse sand (30-40%) and cement stabilizer');
    }

    // RIBBON TEST (ideal: 50-100mm) - 15 points max
    if (testData.tests.ribbonTest) {
      const ribbon = testData.tests.ribbonTest.ribbonLength;
      if (ribbon >= 50 && ribbon <= 100) {
        score += 15;
      } else if (ribbon >= 25 && ribbon < 50) {
        score += 10;
        recommendations.push('Moderate clay content - test with 5% cement');
      } else if (ribbon > 100 && ribbon <= 150) {
        score += 8;
        warnings.push('High plasticity - monitor for shrinkage');
      } else if (ribbon < 25) {
        score += 5;
        recommendations.push('Low clay - may need stabilization');
      } else {
        score += 5;
        warnings.push('Very high plasticity - stabilization essential');
      }
    }

    // BALL DROP TEST (ideal: cracked but holds) - 15 points max
    if (testData.tests.ballDropTest) {
      const ballDrop = testData.tests.ballDropTest.result;
      if (ballDrop === 'cracked_not_shattered') {
        score += 15; // Perfect
        recommendations.push('Moisture level appears optimal for compaction');
      } else if (ballDrop === 'intact') {
        score += 10;
        recommendations.push('Ball stayed intact - test with slightly less moisture');
      } else if (ballDrop === 'shattered') {
        score += 5;
        warnings.push('Ball shattered - soil may be too dry or lack clay');
        recommendations.push('Add moisture or clay content');
      } else if (ballDrop === 'splattered') {
        score += 5;
        warnings.push('Ball splattered - moisture too high');
        recommendations.push('Reduce moisture content for testing');
      }
    }

    // Determine category based on total score
    let category;
    if (score >= 85) {
      category = 'excellent';
    } else if (score >= 70) {
      category = 'suitable';
    } else if (score >= 50) {
      category = 'marginal';
    } else {
      category = 'unsuitable';
    }

    // Add category-specific recommendations
    this.addCategoryRecommendations(category, recommendations, sand, clay);

    // Add moisture recommendations
    recommendations.push('Optimal moisture for ramming: 10-12% (soil should barely stick together)');

    return {
      score,
      category,
      recommendations,
      warnings,
      confidenceLevel: 100,
      isPreliminary: false
    };
  }

  /**
   * Calculate preliminary suitability without jar test data
   * Uses field observations from other 3 tests to estimate
   */
  calculatePreliminarySuitability(testData) {
    let score = 0;
    const warnings = [];
    const recommendations = [];
    let estimatedSand = 50;
    let estimatedSilt = 25;
    let estimatedClay = 25;

    // Estimate composition from visual and ribbon tests
    if (testData.tests.visualTest) {
      const texture = testData.tests.visualTest.texture;
      if (texture === 'coarse') {
        estimatedSand = 70;
        estimatedSilt = 20;
        estimatedClay = 10;
      } else if (texture === 'smooth') {
        estimatedSand = 40;
        estimatedSilt = 40;
        estimatedClay = 20;
      } else if (texture === 'sticky') {
        estimatedSand = 35;
        estimatedSilt = 30;
        estimatedClay = 35;
      }
    }

    // Refine estimates from ribbon test
    if (testData.tests.ribbonTest) {
      const ribbonLength = testData.tests.ribbonTest.ribbonLength;
      if (ribbonLength < 25) {
        // Low clay
        estimatedClay = Math.max(estimatedClay - 10, 5);
        estimatedSand += 10;
        score += 15;
        warnings.push('Low clay content suggested by ribbon test');
      } else if (ribbonLength >= 25 && ribbonLength <= 100) {
        // Good clay range
        score += 25;
      } else if (ribbonLength > 100) {
        // High clay
        estimatedClay = Math.min(estimatedClay + 15, 45);
        estimatedSand -= 10;
        score += 15;
        warnings.push('High clay content suggested by ribbon test');
      }
    }

    // Ball drop test evaluation
    if (testData.tests.ballDropTest) {
      const ballDrop = testData.tests.ballDropTest.result;
      if (ballDrop === 'cracked_not_shattered') {
        score += 20;
        recommendations.push('Good binding properties observed');
      } else if (ballDrop === 'intact') {
        score += 15;
        recommendations.push('Strong binding - may indicate higher clay content');
        estimatedClay += 5;
        estimatedSand -= 5;
      } else if (ballDrop === 'shattered') {
        score += 10;
        warnings.push('Weak binding - may need stabilization');
        estimatedSand += 10;
        estimatedClay -= 10;
      } else if (ballDrop === 'splattered') {
        score += 10;
        warnings.push('High moisture - test again when drier');
      }
    }

    // Normalize estimates
    const total = estimatedSand + estimatedSilt + estimatedClay;
    estimatedSand = Math.round((estimatedSand / total) * 100);
    estimatedSilt = Math.round((estimatedSilt / total) * 100);
    estimatedClay = 100 - estimatedSand - estimatedSilt;

    // General assessment based on estimated composition
    if (estimatedSand >= 50 && estimatedSand <= 75 && estimatedClay >= 10 && estimatedClay <= 20) {
      score += 20;
    } else if (estimatedSand >= 40 && estimatedSand <= 85) {
      score += 10;
    } else {
      score += 5;
      warnings.push('Soil composition may be outside optimal range');
    }

    // Organic matter check
    if (testData.tests.visualTest) {
      const organicMatter = testData.tests.visualTest.organicMatter;
      if (organicMatter === 'high') {
        score -= 10;
        warnings.push('High organic matter - may cause structural issues');
        recommendations.push('Remove topsoil layer, test soil from deeper layers');
      } else if (organicMatter === 'medium') {
        warnings.push('Some organic matter present - monitor for decomposition');
      } else {
        score += 5;
      }
    }

    // Determine category
    let category;
    if (score >= 60) {
      category = 'suitable';
    } else if (score >= 40) {
      category = 'marginal';
    } else {
      category = 'unsuitable';
    }

    // Add preliminary-specific messaging
    recommendations.unshift('⚠️ These are preliminary results based on field observations');
    recommendations.push('📊 Complete the Jar Test (24hr) for precise composition data and refined score');
    warnings.push('Composition estimates are approximate - jar test needed for accuracy');

    // Add category recommendations
    this.addCategoryRecommendations(category, recommendations, estimatedSand, estimatedClay);

    return {
      score,
      category,
      recommendations,
      warnings,
      confidenceLevel: 65,
      isPreliminary: true,
      estimatedComposition: {
        sand: estimatedSand,
        silt: estimatedSilt,
        clay: estimatedClay
      }
    };
  }

  /**
   * Calculate jar test percentages
   */
  calculateJarTestPercentages(jarTest) {
    const total = jarTest.totalHeight ||
                  (jarTest.sandHeight + jarTest.siltHeight + jarTest.clayHeight);

    if (total === 0) {
      jarTest.sandPct = 0;
      jarTest.siltPct = 0;
      jarTest.clayPct = 0;
      return;
    }

    jarTest.sandPct = Math.round((jarTest.sandHeight / total) * 100);
    jarTest.siltPct = Math.round((jarTest.siltHeight / total) * 100);
    jarTest.clayPct = Math.round((jarTest.clayHeight / total) * 100);

    // Ensure percentages add up to 100
    const sum = jarTest.sandPct + jarTest.siltPct + jarTest.clayPct;
    if (sum !== 100 && sum > 0) {
      // Adjust the largest component
      const max = Math.max(jarTest.sandPct, jarTest.siltPct, jarTest.clayPct);
      if (jarTest.sandPct === max) {
        jarTest.sandPct += (100 - sum);
      } else if (jarTest.siltPct === max) {
        jarTest.siltPct += (100 - sum);
      } else {
        jarTest.clayPct += (100 - sum);
      }
    }
  }

  /**
   * Add category-specific recommendations
   */
  addCategoryRecommendations(category, recommendations, sand, clay) {
    switch (category) {
      case 'excellent':
        recommendations.unshift('Excellent soil for rammed earth construction!');
        recommendations.push('Test small sample blocks before full construction');
        break;

      case 'suitable':
        recommendations.unshift('Good soil for rammed earth with minor adjustments');
        recommendations.push('Consider test blocks with varying stabilizer ratios');
        break;

      case 'marginal':
        recommendations.unshift('Soil requires modification for rammed earth use');
        recommendations.push('Consult with experienced rammed earth builder');
        recommendations.push('Test multiple stabilizer ratios before committing');
        break;

      case 'unsuitable':
        recommendations.unshift('Soil needs significant modification');
        recommendations.push('Consider sourcing alternative soil or blending with purchased materials');
        recommendations.push('Professional consultation strongly recommended');
        break;
    }
  }

  /**
   * Get category display info
   */
  getCategoryInfo(category) {
    const info = {
      excellent: {
        title: 'Excellent for Rammed Earth',
        emoji: '✓',
        color: '#4CAF50',
        description: 'Ideal soil composition for rammed earth construction with minimal intervention needed'
      },
      suitable: {
        title: 'Suitable for Rammed Earth',
        emoji: '✓',
        color: '#8B4513',
        description: 'Good soil for rammed earth construction with minor adjustments'
      },
      marginal: {
        title: 'Marginal - Modification Required',
        emoji: '⚠',
        color: '#FFB300',
        description: 'Soil requires stabilization or significant modification for rammed earth use'
      },
      unsuitable: {
        title: 'Not Suitable - Major Changes Needed',
        emoji: '✗',
        color: '#D32F2F',
        description: 'Soil composition is not recommended for rammed earth without major intervention'
      }
    };

    return info[category] || info.marginal;
  }

  /**
   * Format test results for display
   */
  formatResults(testData) {
    const result = this.calculateSuitability(testData);
    const categoryInfo = this.getCategoryInfo(result.category);

    // Use estimated composition for preliminary results, actual for final
    let composition;
    if (result.isPreliminary) {
      composition = result.estimatedComposition;
    } else {
      composition = {
        sand: testData.tests.jarTest.sandPct,
        silt: testData.tests.jarTest.siltPct,
        clay: testData.tests.jarTest.clayPct
      };
    }

    return {
      ...result,
      categoryInfo,
      composition
    };
  }

  /**
   * Generate shareable text summary
   */
  generateSummary(testData, result) {
    const { category, score, composition } = result;
    const categoryInfo = this.getCategoryInfo(category);

    let summary = `Soil Test Results\n`;
    summary += `=================\n\n`;
    summary += `Category: ${categoryInfo.title}\n`;
    summary += `Score: ${score}/100\n\n`;
    summary += `Composition:\n`;
    summary += `- Sand: ${composition.sand}%\n`;
    summary += `- Silt: ${composition.silt}%\n`;
    summary += `- Clay: ${composition.clay}%\n\n`;

    if (result.recommendations.length > 0) {
      summary += `Recommendations:\n`;
      result.recommendations.forEach((rec, i) => {
        summary += `${i + 1}. ${rec}\n`;
      });
      summary += `\n`;
    }

    if (result.warnings.length > 0) {
      summary += `Cautions:\n`;
      result.warnings.forEach((warn, i) => {
        summary += `${i + 1}. ${warn}\n`;
      });
    }

    summary += `\nTested with: Rammed Earth Soil Tester\n`;
    summary += `https://rammedearth.in/soil-test/\n`;

    return summary;
  }
}

// Export singleton instance
const testLogic = new TestLogic();

export default testLogic;
