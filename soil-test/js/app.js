/**
 * Main App Logic
 */

// Determine which page we're on
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ========================================
// LANDING PAGE (index.html)
// ========================================

if (currentPage === 'index.html' || currentPage === '' || currentPage === 'soil-test' || currentPage === 'soil-test/') {
  document.addEventListener('DOMContentLoaded', initLandingPage);
}

function initLandingPage() {
  // Start test buttons
  const startBtns = document.querySelectorAll('#startTestBtn, #startTestBtnBottom');
  startBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', startNewTest);
    }
  });

  // PWA install prompt
  let deferredPrompt;
  const installPrompt = document.getElementById('installPrompt');
  const installBtn = document.getElementById('installBtn');
  const dismissInstallBtn = document.getElementById('dismissInstallBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installPrompt) {
      installPrompt.classList.remove('hidden');
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        deferredPrompt = null;
        installPrompt.classList.add('hidden');
      }
    });
  }

  if (dismissInstallBtn) {
    dismissInstallBtn.addEventListener('click', () => {
      installPrompt.classList.add('hidden');
    });
  }

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.error('Service worker registration failed:', err);
    });
  }
}

function startNewTest() {
  // Clear any existing test data
  sessionStorage.removeItem('currentTest');
  sessionStorage.removeItem('currentStep');

  // Navigate to test page
  window.location.href = 'test.html';
}

// ========================================
// TEST FLOW PAGE (test.html)
// ========================================

if (currentPage === 'test.html') {
  document.addEventListener('DOMContentLoaded', initTestPage);
}

let testProtocols = null;
let currentTestData = null;
let currentStepIndex = 0;
let currentTestPhotos = [];

async function initTestPage() {
  // Load test protocols
  try {
    const response = await fetch('data/test-protocols.json');
    testProtocols = await response.json();
  } catch (error) {
    console.error('Failed to load test protocols:', error);
    alert('Failed to load test protocols. Please refresh the page.');
    return;
  }

  // Initialize or load current test
  currentTestData = sessionStorage.getItem('currentTest');
  if (currentTestData) {
    currentTestData = JSON.parse(currentTestData);
  } else {
    currentTestData = initializeNewTest();
  }

  // Load current step
  const savedStep = sessionStorage.getItem('currentStep');
  currentStepIndex = savedStep ? parseInt(savedStep) : 0;

  // Render current step
  renderTestStep(currentStepIndex);

  // Setup camera modal
  setupCameraModal();
}

function initializeNewTest() {
  const testId = generateId();

  const test = {
    id: testId,
    timestamp: new Date().toISOString(),
    version: '1.0',
    location: null,
    tests: {
      jarTest: { photos: [], measurements: {} },
      ribbonTest: { photos: [] },
      ballDropTest: { photos: [] },
      visualTest: { photos: [] }
    },
    result: null,
    user: { anonymous: true },
    submitted: false
  };

  sessionStorage.setItem('currentTest', JSON.stringify(test));
  return test;
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function renderTestStep(stepIndex) {
  const container = document.getElementById('testContainer');
  if (!container) return;

  const test = testProtocols.tests[stepIndex];
  const testId = test.id;

  // Update progress bar
  updateProgressBar(stepIndex);

  // Build step HTML
  const stepHTML = `
    <div class="test-step active">
      <div class="test-step-header">
        <div class="test-step-title">
          <span class="step-badge">Step ${stepIndex + 1} of ${testProtocols.tests.length}</span>
          <h2>${test.name}</h2>
        </div>
        <p>${test.description}</p>
        <p class="note">Duration: ${test.duration}</p>
      </div>

      <div class="test-instructions">
        <h3>Instructions</h3>
        <ol>
          ${test.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ol>
      </div>

      <div class="photo-section">
        <h3>Photo Documentation</h3>
        <p>Guidelines:</p>
        <ul>
          ${test.photoGuidelines.map(guideline => `<li>${guideline}</li>`).join('')}
        </ul>
        <button class="btn btn-primary" onclick="openCamera('${testId}')">
          📷 Take Photo
        </button>
        <div class="photo-preview-container" id="photoPreview-${testId}">
          ${renderPhotoPreview(testId)}
        </div>
      </div>

      <form id="testForm-${testId}" class="test-form">
        ${renderFormFields(test.fields, testId)}
      </form>

      <div class="test-navigation">
        ${stepIndex > 0 ? '<button class="btn btn-outline" onclick="previousStep()">← Previous</button>' : '<div class="nav-spacer"></div>'}
        ${stepIndex < testProtocols.tests.length - 1
          ? '<button class="btn btn-primary" onclick="nextStep()">Next →</button>'
          : '<button class="btn btn-primary" onclick="completeTest()">Complete Test</button>'}
      </div>
    </div>
  `;

  container.innerHTML = stepHTML;

  // Load existing data into form
  loadFormData(testId);

  // Save step index
  sessionStorage.setItem('currentStep', stepIndex.toString());
}

function renderFormFields(fields, testId) {
  return fields.map(field => {
    let inputHTML = '';

    switch (field.type) {
      case 'number':
        inputHTML = `
          <div class="input-unit">
            <input
              type="number"
              id="${testId}-${field.id}"
              name="${field.id}"
              class="form-input"
              ${field.required ? 'required' : ''}
              ${field.min !== undefined ? `min="${field.min}"` : ''}
              ${field.max !== undefined ? `max="${field.max}"` : ''}
              placeholder="${field.placeholder || ''}"
            />
            ${field.unit ? `<span>${field.unit}</span>` : ''}
          </div>
        `;
        break;

      case 'select':
        inputHTML = `
          <select
            id="${testId}-${field.id}"
            name="${field.id}"
            class="form-select"
            ${field.required ? 'required' : ''}
          >
            <option value="">Select...</option>
            ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
        `;
        break;

      case 'textarea':
        inputHTML = `
          <textarea
            id="${testId}-${field.id}"
            name="${field.id}"
            class="form-textarea"
            ${field.required ? 'required' : ''}
            placeholder="${field.placeholder || ''}"
          ></textarea>
        `;
        break;
    }

    return `
      <div class="form-group">
        <label class="form-label" for="${testId}-${field.id}">
          ${field.label}
          ${field.required ? '<span style="color: var(--error)">*</span>' : ''}
        </label>
        ${inputHTML}
        ${field.hint ? `<p class="form-hint">${field.hint}</p>` : ''}
      </div>
    `;
  }).join('');
}

function renderPhotoPreview(testId) {
  const photos = currentTestData.tests[testId].photos || [];

  if (photos.length === 0) {
    return '<p class="note">No photos yet</p>';
  }

  return photos.map((photo, index) => `
    <div class="photo-preview-item">
      <img src="${photo}" alt="Test photo ${index + 1}">
      <button class="photo-delete-btn" onclick="deletePhoto('${testId}', ${index})">×</button>
    </div>
  `).join('');
}

function loadFormData(testId) {
  const testData = currentTestData.tests[testId];
  if (!testData) return;

  // Load form values
  Object.keys(testData).forEach(key => {
    if (key !== 'photos') {
      const element = document.getElementById(`${testId}-${key}`);
      if (element) {
        element.value = testData[key] || '';
      }
    }
  });
}

function saveFormData(testId) {
  const form = document.getElementById(`testForm-${testId}`);
  if (!form) return false;

  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  // Save form data
  const formData = new FormData(form);
  const testData = currentTestData.tests[testId];

  formData.forEach((value, key) => {
    // Convert numbers
    if (!isNaN(value) && value !== '') {
      testData[key] = parseFloat(value);
    } else {
      testData[key] = value;
    }
  });

  // For jar test, calculate percentages
  if (testId === 'jarTest') {
    calculateJarTestPercentages();
  }

  // Save to session storage
  sessionStorage.setItem('currentTest', JSON.stringify(currentTestData));
  return true;
}

function calculateJarTestPercentages() {
  const jarTest = currentTestData.tests.jarTest;
  const total = jarTest.totalHeight || (jarTest.sandHeight + jarTest.siltHeight + jarTest.clayHeight);

  if (total > 0) {
    jarTest.sandPct = Math.round((jarTest.sandHeight / total) * 100);
    jarTest.siltPct = Math.round((jarTest.siltHeight / total) * 100);
    jarTest.clayPct = Math.round((jarTest.clayHeight / total) * 100);
  }
}

function updateProgressBar(stepIndex) {
  const steps = document.querySelectorAll('.progress-step');
  steps.forEach((step, index) => {
    step.classList.remove('active', 'completed');
    if (index < stepIndex) {
      step.classList.add('completed');
    } else if (index === stepIndex) {
      step.classList.add('active');
    }
  });
}

function previousStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderTestStep(currentStepIndex);
  }
}

function nextStep() {
  const currentTest = testProtocols.tests[currentStepIndex];

  // Save current step data
  if (!saveFormData(currentTest.id)) {
    return;
  }

  // Check if photos are required (at least one)
  if (currentTestData.tests[currentTest.id].photos.length === 0) {
    alert('Please take at least one photo before proceeding.');
    return;
  }

  // After completing 3rd test (Ball Drop at index 2), offer choice
  if (currentStepIndex === 2) {
    showPreliminaryResultsChoice();
    return;
  }

  if (currentStepIndex < testProtocols.tests.length - 1) {
    currentStepIndex++;
    renderTestStep(currentStepIndex);
    window.scrollTo(0, 0);
  }
}

function showPreliminaryResultsChoice() {
  const message = `
🎉 Great! You've completed 3 quick field tests!

You now have two options:

1️⃣ VIEW PRELIMINARY RESULTS NOW (recommended)
   • Get immediate soil assessment
   • Based on your field observations
   • ~65% confidence level
   • Takes 30 seconds

2️⃣ CONTINUE TO JAR TEST
   • Set up jar test (5 minutes)
   • Wait 24 hours for settling
   • Get precise composition data
   • ~100% confidence level

Most users view preliminary results first, then return later for the jar test to refine their assessment.

What would you like to do?
  `.trim();

  if (confirm(message + '\n\nClick OK for PRELIMINARY RESULTS\nClick Cancel to CONTINUE TO JAR TEST')) {
    // Go to preliminary results
    goToPreliminaryResults();
  } else {
    // Continue to jar test
    currentStepIndex++;
    renderTestStep(currentStepIndex);
    window.scrollTo(0, 0);
  }
}

async function goToPreliminaryResults() {
  // Mark as preliminary
  currentTestData.isPreliminary = true;

  // Request location
  showLoading('Getting location...');

  try {
    const { default: geolocation } = await import('./geolocation.js');
    const locationResult = await geolocation.getLocationSafe();

    if (locationResult.success) {
      currentTestData.location = locationResult.location;
    }
  } catch (error) {
    console.error('Location error:', error);
  }

  hideLoading();

  // Save test to storage
  showLoading('Saving test data...');

  try {
    const { default: storage } = await import('./storage.js');
    await storage.saveTest(currentTestData);
    sessionStorage.setItem('currentTestId', currentTestData.id);
    sessionStorage.setItem('isPreliminary', 'true');
  } catch (error) {
    console.error('Storage error:', error);
    alert('Failed to save test data');
    hideLoading();
    return;
  }

  hideLoading();

  // Navigate to results page
  window.location.href = 'results.html';
}

async function completeTest() {
  const currentTest = testProtocols.tests[currentStepIndex];

  // Save current step data
  if (!saveFormData(currentTest.id)) {
    return;
  }

  // Request location
  showLoading('Getting location...');

  try {
    // Dynamically import geolocation module
    const { default: geolocation } = await import('./geolocation.js');
    const locationResult = await geolocation.getLocationSafe();

    if (locationResult.success) {
      currentTestData.location = locationResult.location;
    }
  } catch (error) {
    console.error('Location error:', error);
  }

  hideLoading();

  // Save test to storage
  showLoading('Saving test data...');

  try {
    const { default: storage } = await import('./storage.js');
    await storage.saveTest(currentTestData);
    sessionStorage.setItem('currentTestId', currentTestData.id);
  } catch (error) {
    console.error('Storage error:', error);
    alert('Failed to save test data');
    hideLoading();
    return;
  }

  hideLoading();

  // Navigate to results page
  window.location.href = 'results.html';
}

// Camera functions
let activeTestId = null;

function setupCameraModal() {
  const modal = document.getElementById('cameraModal');
  const closeBtn = document.getElementById('closeCameraBtn');
  const captureBtn = document.getElementById('captureBtn');
  const retakeBtn = document.getElementById('retakeBtn');
  const usePhotoBtn = document.getElementById('usePhotoBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCamera);
  }

  if (captureBtn) {
    captureBtn.addEventListener('click', capturePhoto);
  }

  if (retakeBtn) {
    retakeBtn.addEventListener('click', retakePhoto);
  }

  if (usePhotoBtn) {
    usePhotoBtn.addEventListener('click', usePhoto);
  }
}

async function openCamera(testId) {
  activeTestId = testId;

  const modal = document.getElementById('cameraModal');
  const video = document.getElementById('cameraPreview');
  const preview = document.getElementById('photoPreview');
  const canvas = document.getElementById('photoCanvas');

  // Reset UI
  video.classList.remove('hidden');
  preview.classList.add('hidden');
  canvas.classList.add('hidden');
  document.getElementById('captureBtn').classList.remove('hidden');
  document.getElementById('retakeBtn').classList.add('hidden');
  document.getElementById('usePhotoBtn').classList.add('hidden');
  document.getElementById('cameraGuidelinesOverlay').classList.remove('hidden');

  modal.classList.remove('hidden');

  try {
    const { default: camera } = await import('./camera.js');
    await camera.init(video);
  } catch (error) {
    alert(error.message);
    closeCamera();
  }
}

async function capturePhoto() {
  const video = document.getElementById('cameraPreview');
  const preview = document.getElementById('photoPreview');
  const canvas = document.getElementById('photoCanvas');

  try {
    const { default: camera } = await import('./camera.js');
    const photoDataURL = camera.capturePhoto(canvas);

    // Show preview
    preview.src = photoDataURL;
    video.classList.add('hidden');
    preview.classList.remove('hidden');
    document.getElementById('cameraGuidelinesOverlay').classList.add('hidden');

    // Update buttons
    document.getElementById('captureBtn').classList.add('hidden');
    document.getElementById('retakeBtn').classList.remove('hidden');
    document.getElementById('usePhotoBtn').classList.remove('hidden');
  } catch (error) {
    alert('Failed to capture photo: ' + error.message);
  }
}

async function retakePhoto() {
  const video = document.getElementById('cameraPreview');
  const preview = document.getElementById('photoPreview');

  video.classList.remove('hidden');
  preview.classList.add('hidden');
  document.getElementById('cameraGuidelinesOverlay').classList.remove('hidden');

  document.getElementById('captureBtn').classList.remove('hidden');
  document.getElementById('retakeBtn').classList.add('hidden');
  document.getElementById('usePhotoBtn').classList.add('hidden');

  const { default: camera } = await import('./camera.js');
  camera.reset();
}

async function usePhoto() {
  const { default: camera } = await import('./camera.js');
  const photoDataURL = camera.getCapturedPhoto();

  if (photoDataURL && activeTestId) {
    // Add photo to current test
    if (!currentTestData.tests[activeTestId].photos) {
      currentTestData.tests[activeTestId].photos = [];
    }
    currentTestData.tests[activeTestId].photos.push(photoDataURL);

    // Update session storage
    sessionStorage.setItem('currentTest', JSON.stringify(currentTestData));

    // Update photo preview
    const previewContainer = document.getElementById(`photoPreview-${activeTestId}`);
    if (previewContainer) {
      previewContainer.innerHTML = renderPhotoPreview(activeTestId);
    }
  }

  closeCamera();
}

async function closeCamera() {
  const modal = document.getElementById('cameraModal');
  modal.classList.add('hidden');

  try {
    const { default: camera } = await import('./camera.js');
    camera.stop();
  } catch (error) {
    console.error('Error closing camera:', error);
  }

  activeTestId = null;
}

function deletePhoto(testId, photoIndex) {
  if (confirm('Delete this photo?')) {
    currentTestData.tests[testId].photos.splice(photoIndex, 1);
    sessionStorage.setItem('currentTest', JSON.stringify(currentTestData));

    const previewContainer = document.getElementById(`photoPreview-${testId}`);
    if (previewContainer) {
      previewContainer.innerHTML = renderPhotoPreview(testId);
    }
  }
}

function showLoading(message = 'Loading...') {
  const overlay = document.getElementById('loadingOverlay');
  const text = document.getElementById('loadingText');
  if (overlay) {
    overlay.classList.remove('hidden');
    if (text) text.textContent = message;
  }
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.add('hidden');
}

// Export functions to window for onclick handlers
window.openCamera = openCamera;
window.deletePhoto = deletePhoto;
window.previousStep = previousStep;
window.nextStep = nextStep;
window.completeTest = completeTest;
window.capturePhoto = capturePhoto;
window.retakePhoto = retakePhoto;
window.usePhoto = usePhoto;
window.closeCamera = closeCamera;

// ========================================
// RESULTS PAGE (results.html)
// ========================================

if (currentPage === 'results.html') {
  document.addEventListener('DOMContentLoaded', initResultsPage);
}

async function initResultsPage() {
  showLoading('Calculating results...');

  try {
    // Load modules
    const { default: storage } = await import('./storage.js');
    const { default: testLogic } = await import('./test-logic.js');

    // Get test data
    const testId = sessionStorage.getItem('currentTestId');
    if (!testId) {
      alert('No test data found');
      window.location.href = 'index.html';
      return;
    }

    const testData = await storage.getTest(testId);
    if (!testData) {
      alert('Test data not found');
      window.location.href = 'index.html';
      return;
    }

    // Calculate results
    const results = testLogic.formatResults(testData);

    // Store results
    testData.result = results;
    await storage.saveTest(testData);

    // Display results
    displayResults(testData, results);

    hideLoading();

    // Setup event handlers
    setupResultsHandlers(testData, results);
  } catch (error) {
    console.error('Error loading results:', error);
    alert('Failed to load results');
    hideLoading();
  }
}

function displayResults(testData, results) {
  // Show preliminary banner if applicable
  if (results.isPreliminary) {
    const header = document.querySelector('.results-header');
    const banner = document.createElement('div');
    banner.style.cssText = 'background: #FFB300; color: white; padding: 1rem; text-align: center; font-weight: bold; border-radius: 8px; margin-bottom: 1rem;';
    banner.innerHTML = `
      ⚠️ PRELIMINARY RESULTS (${results.confidenceLevel}% Confidence)
      <br><small>Complete jar test in 24 hours for refined results with precise composition data</small>
    `;
    header.insertAdjacentElement('beforebegin', banner);
  }

  // Update header
  const header = document.querySelector('.results-header');
  header.classList.add(results.category);

  document.getElementById('resultCategory').textContent = results.categoryInfo.title;
  document.getElementById('scoreValue').textContent = results.score;
  document.getElementById('scoreLabel').textContent = results.isPreliminary ? 'Preliminary Score' : 'Suitability Score';

  // Set score circle color
  const scoreCircle = document.getElementById('scoreCircle');
  scoreCircle.style.setProperty('--score-percentage', results.score);

  // Composition bars
  const estimateLabel = results.isPreliminary ? ' (estimated)' : '';
  document.getElementById('sandPct').textContent = `${results.composition.sand}%${estimateLabel}`;
  document.getElementById('siltPct').textContent = `${results.composition.silt}%${estimateLabel}`;
  document.getElementById('clayPct').textContent = `${results.composition.clay}%${estimateLabel}`;

  document.getElementById('sandBar').style.width = `${results.composition.sand}%`;
  document.getElementById('siltBar').style.width = `${results.composition.silt}%`;
  document.getElementById('clayBar').style.width = `${results.composition.clay}%`;

  // For preliminary results, add a note about completing jar test
  if (results.isPreliminary) {
    const compositionSection = document.querySelector('.composition-section');
    const note = document.createElement('p');
    note.style.cssText = 'margin-top: 1rem; padding: 0.5rem; background: #FFF3CD; border-radius: 8px; font-size: 0.9em;';
    note.textContent = '📊 These percentages are estimated from field observations. Complete the jar test for precise measurements.';
    compositionSection.querySelector('.ideal-range').insertAdjacentElement('afterend', note);
  }

  // Test summaries
  if (testData.tests.ribbonTest) {
    const ribbonLength = testData.tests.ribbonTest.ribbonLength;
    const strength = testData.tests.ribbonTest.strength;
    document.getElementById('ribbonResult').textContent = `${ribbonLength}mm - ${strength}`;
  }

  if (testData.tests.ballDropTest) {
    const result = testData.tests.ballDropTest.result.replace(/_/g, ' ');
    document.getElementById('ballDropResult').textContent = result;
  }

  if (testData.tests.visualTest) {
    const color = testData.tests.visualTest.color?.replace(/_/g, ' ') || 'N/A';
    document.getElementById('visualResult').textContent = color;
  }

  // Recommendations
  const recList = document.getElementById('recommendationsList');
  recList.innerHTML = results.recommendations.map(rec => `<li>${rec}</li>`).join('');

  // Warnings
  if (results.warnings.length > 0) {
    const warnList = document.getElementById('warningsList');
    warnList.innerHTML = results.warnings.map(warn => `<li>${warn}</li>`).join('');
  } else {
    document.getElementById('warningsSection').classList.add('hidden');
  }

  // Location
  if (testData.location) {
    const { default: geolocation } = import('./geolocation.js');
    geolocation.then(geo => {
      const coordsText = geo.formatCoordinates(testData.location.lat, testData.location.lng);
      document.getElementById('locationInfo').textContent = coordsText;
      document.getElementById('locationCoords').textContent =
        `${testData.location.lat.toFixed(6)}, ${testData.location.lng.toFixed(6)} (±${testData.location.accuracy.toFixed(0)}m)`;
    });
  } else {
    document.getElementById('locationInfo').textContent = 'Location data not available';
  }

  // Photos
  displayPhotoGallery(testData);
}

function displayPhotoGallery(testData) {
  const gallery = document.getElementById('photoGallery');
  const allPhotos = [];

  Object.entries(testData.tests).forEach(([testId, testInfo]) => {
    if (testInfo.photos && testInfo.photos.length > 0) {
      testInfo.photos.forEach((photo, index) => {
        allPhotos.push({
          url: photo,
          label: `${testId} - Photo ${index + 1}`
        });
      });
    }
  });

  if (allPhotos.length === 0) {
    gallery.innerHTML = '<p class="note">No photos available</p>';
    return;
  }

  gallery.innerHTML = allPhotos.map((photo, index) => `
    <div class="gallery-item" onclick="viewPhoto(${index})">
      <img src="${photo.url}" alt="${photo.label}">
      <div class="gallery-item-label">${photo.label}</div>
    </div>
  `).join('');
}

function setupResultsHandlers(testData, results) {
  // Complete Jar Test button (for preliminary results)
  if (results.isPreliminary) {
    const completeJarBtn = document.createElement('button');
    completeJarBtn.id = 'completeJarTestBtn';
    completeJarBtn.className = 'btn btn-primary';
    completeJarBtn.style.cssText = 'margin-bottom: 0.5rem;';
    completeJarBtn.innerHTML = '🧪 Complete Jar Test (24hr) for Refined Results';

    completeJarBtn.addEventListener('click', () => {
      if (confirm('Ready to complete the jar test?\n\nMake sure you\'ve set up your jar test and waited 24 hours for settling.\n\nClick OK to continue to jar test measurement.')) {
        // Resume test at step 4 (jar test)
        sessionStorage.setItem('currentTest', JSON.stringify(testData));
        sessionStorage.setItem('currentStep', '3'); // Index 3 = jar test
        window.location.href = 'test.html';
      }
    });

    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
      actionButtons.insertBefore(completeJarBtn, actionButtons.firstChild);
    }
  }

  // New test button
  document.getElementById('newTestBtn')?.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
  });

  // Share button
  document.getElementById('shareResultsBtn')?.addEventListener('click', async () => {
    const { default: testLogic } = await import('./test-logic.js');
    const summary = testLogic.generateSummary(testData, results);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Soil Test Results',
          text: summary
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(summary).then(() => {
        alert('Results copied to clipboard!');
      });
    }
  });

  // View raw data
  document.getElementById('viewRawDataBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('rawDataModal');
    const content = document.getElementById('rawDataContent');
    content.textContent = JSON.stringify(testData, null, 2);
    modal.classList.remove('hidden');
  });

  document.getElementById('closeRawDataBtn')?.addEventListener('click', () => {
    document.getElementById('rawDataModal').classList.add('hidden');
  });

  document.getElementById('copyRawDataBtn')?.addEventListener('click', () => {
    const content = document.getElementById('rawDataContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
      alert('Data copied to clipboard!');
    });
  });

  // Submit data button (placeholder - would integrate with Firebase)
  document.getElementById('submitDataBtn')?.addEventListener('click', () => {
    alert('Data submission feature coming soon! This will upload your test results to help improve soil testing.');
  });

  // Download PDF button (placeholder)
  document.getElementById('downloadPdfBtn')?.addEventListener('click', () => {
    window.print();
  });
}

window.viewPhoto = function(index) {
  // Simple photo viewer - could be enhanced with a modal
  alert('Photo viewer - feature coming soon!');
};
