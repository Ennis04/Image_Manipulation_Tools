const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");

const previewWrap = document.getElementById("previewWrap");
const previewImg = document.getElementById("previewImg");

const cancelBtn = document.getElementById("cancelBtn");
const nextBtn = document.getElementById("nextBtn");

const actionRow = document.getElementById("actionRow");
const uploadCard = document.querySelector(".upload-card");

// We'll store the chosen image as a Data URL here
let selectedDataUrl = null;

function enterPreviewModeWithDataUrl(dataUrl) {
  selectedDataUrl = dataUrl;

  previewImg.src = dataUrl;
  previewWrap.classList.remove("hidden");
  actionRow.classList.remove("hidden");
  uploadCard.classList.add("preview-mode");
}

function exitPreviewMode() {
  selectedDataUrl = null;

  previewWrap.classList.add("hidden");
  actionRow.classList.add("hidden");
  uploadCard.classList.remove("preview-mode");

  previewImg.src = "";
  fileInput.value = "";
  sessionStorage.removeItem("valo_selected_image");
}

// Convert an uploaded File to Data URL
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // Data URL string
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Convert an image URL (sample) to Data URL
async function urlToDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Upload button -> open picker
uploadBtn.addEventListener("click", () => fileInput.click());

// Uploaded file -> preview
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const dataUrl = await fileToDataUrl(file);
  enterPreviewModeWithDataUrl(dataUrl);
});

// Sample clicked -> preview
document.querySelectorAll(".thumb").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const src = btn.getAttribute("data-src");
    if (!src) return;

    const dataUrl = await urlToDataUrl(src);
    enterPreviewModeWithDataUrl(dataUrl);
  });
});

// Cancel -> back to upload
cancelBtn.addEventListener("click", () => exitPreviewMode());

// Next -> save + go
nextBtn.addEventListener("click", () => {
  if (!selectedDataUrl) return; // safety

  // Save for the next page (tab/session only)
  sessionStorage.setItem("valo_selected_image", selectedDataUrl);

  window.location.href = "operation.html";
});
