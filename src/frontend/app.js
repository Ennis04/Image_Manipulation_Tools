// ===========================
// operation.js (FRONTEND ONLY)
// - no backend
// - tabs switching
// - slider <-> number sync
// - reset buttons
// - preview image visual feedback (CSS filters)
// ===========================

window.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // Image setup
  // ----------------------------
  const mainImage = document.getElementById("mainImage");
  const originalImageDataUrl = sessionStorage.getItem("valo_selected_image");

  if (!originalImageDataUrl) {
    alert("No image selected. Redirecting to home page.");
    window.location.href = "home.html";
    return;
  }

  mainImage.src = originalImageDataUrl;

  // ----------------------------
  // Tabs logic
  // ----------------------------
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");

  function openTab(name) {
    tabs.forEach(t => {
      const active = t.dataset.tab === name;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach(p => {
      p.classList.toggle("is-open", p.dataset.panel === name);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => openTab(tab.dataset.tab));
  });

  // ----------------------------
  // Helpers
  // ----------------------------
  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // ----------------------------
  // Slider <-> Number sync
  // ----------------------------
  function bindRange(rangeId, inputId, onChange) {
    const range = document.getElementById(rangeId);
    const input = document.getElementById(inputId);
    if (!range || !input) return;

    input.value = range.value;

    range.addEventListener("input", () => {
      input.value = range.value;
      onChange?.();
    });

    input.addEventListener("input", () => {
      let v = Number(input.value);
      if (!Number.isFinite(v)) v = 0;
      v = clamp(v, Number(range.min), Number(range.max));
      range.value = v;
      input.value = v;
      onChange?.();
    });
  }

  // ----------------------------
  // Reset buttons
  // ----------------------------
  function bindReset(resetId, rangeId, inputId, defaultValue = 0, onChange) {
    const btn = document.getElementById(resetId);
    const range = document.getElementById(rangeId);
    const input = document.getElementById(inputId);
    if (!btn || !range) return;

    btn.addEventListener("click", () => {
      range.value = defaultValue;
      if (input) input.value = defaultValue;
      onChange?.();
    });
  }

  // ----------------------------
  // Visual preview (CSS filter simulation)
  // ----------------------------
  function updatePreview() {
    const brightness = Number(document.getElementById("brightness")?.value || 0);
    const sharpness = Number(document.getElementById("sharpness")?.value || 0);
    const denoise = Number(document.getElementById("denoise")?.value || 0);

    const red = Number(document.getElementById("red")?.value || 0);
    const green = Number(document.getElementById("green")?.value || 0);
    const blue = Number(document.getElementById("blue")?.value || 0);

    // CSS filters are ONLY visual placeholders
    const cssBrightness = 100 + brightness;
    const cssContrast = 100 + sharpness * 0.6;
    const cssBlur = denoise > 0 ? denoise / 25 : 0;

    mainImage.style.filter = `
      brightness(${cssBrightness}%)
      contrast(${cssContrast}%)
      blur(${cssBlur}px)
    `;

    // RGB tint simulation
    mainImage.style.mixBlendMode = "normal";
    mainImage.style.backgroundColor = `rgb(
      ${255 + red},
      ${255 + green},
      ${255 + blue}
    )`;
  }

  // ----------------------------
  // Bind Adjust tab
  // ----------------------------
  bindRange("brightness", "brightnessInput", updatePreview);
  bindRange("sharpness", "sharpnessInput", updatePreview);
  bindRange("denoise", "denoiseInput", updatePreview);

  bindReset("brightnessReset", "brightness", "brightnessInput", 0, updatePreview);
  bindReset("sharpnessReset", "sharpness", "sharpnessInput", 0, updatePreview);
  bindReset("denoiseReset", "denoise", "denoiseInput", 0, updatePreview);

  // ----------------------------
  // Bind Filter tab (RGB)
  // ----------------------------
  bindRange("red", "redInput", updatePreview);
  bindRange("green", "greenInput", updatePreview);
  bindRange("blue", "blueInput", updatePreview);

  bindReset("redReset", "red", "redInput", 0, updatePreview);
  bindReset("greenReset", "green", "greenInput", 0, updatePreview);
  bindReset("blueReset", "blue", "blueInput", 0, updatePreview);

  // ----------------------------
  // Crop buttons (UI only)
  // ----------------------------
  document.querySelectorAll(".crop-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".crop-btn").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  // ----------------------------
  // Toolbar buttons
  // ----------------------------
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }

  // ----------------------------
  // Initial render
  // ----------------------------
  updatePreview();
});
