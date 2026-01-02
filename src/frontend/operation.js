window.addEventListener("DOMContentLoaded", () => {
      const imgEl = document.getElementById("mainImage");
      const dataUrl = sessionStorage.getItem("valo_selected_image");
      if (!dataUrl) {
        alert("No image selected. Redirecting to home page.");
        window.location.href = "home.html";
        return;
      }
      imgEl.src = dataUrl;

      const bindSlider = (id, outId) => {
        const s = document.getElementById(id);
        const out = document.getElementById(outId);
        const update = () => out.textContent = s.value;
        s.addEventListener("input", update);
        update();
      };

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

    tabs.forEach(t => {
    t.addEventListener("click", () => openTab(t.dataset.tab));
    });


    function bindRangeWithNumber(rangeId, inputId) {
    const range = document.getElementById(rangeId);
    const num = document.getElementById(inputId);
    if (!range || !num) return;

    // range -> number
    range.addEventListener("input", () => {
        num.value = range.value;
    });

    // number -> range (clamp)
    num.addEventListener("input", () => {
        const min = Number(range.min);
        const max = Number(range.max);
        let v = Number(num.value);
        if (Number.isNaN(v)) v = 0;
        v = Math.min(max, Math.max(min, v));
        range.value = v;
        num.value = v;
    });
    }

    bindRangeWithNumber("brightness", "brightnessInput");
    bindRangeWithNumber("sharpness", "sharpnessInput");
    bindRangeWithNumber("denoise", "denoiseInput");
    bindRangeWithNumber("red", "redInput");
    bindRangeWithNumber("green", "greenInput");
    bindRangeWithNumber("blue", "blueInput");

    document.getElementById("cancelBtn").addEventListener("click", () => {
    window.location.href = "home.html";
    });

    const saveModal = document.getElementById("saveModal");
    const fileLocation = document.getElementById("fileLocation");
    const saveBtn = document.getElementById("saveBtn");
    const closeSaveBtn = document.getElementById("closeSaveBtn");
    const doneBtn = document.getElementById("doneBtn");

    function openSaveModal() {
    saveModal.classList.remove("hidden");
    saveModal.setAttribute("aria-hidden", "false");
    fileLocation.value = "";
    setTimeout(() => fileLocation.focus(), 0);
    }

    function closeSaveModal() {
    saveModal.classList.add("hidden");
    saveModal.setAttribute("aria-hidden", "true");
    }

    doneBtn.addEventListener("click", () => {
    openSaveModal();
    });

    closeSaveBtn.addEventListener("click", closeSaveModal);

    saveModal.addEventListener("click", (e) => {
    if (e.target && e.target.dataset && e.target.dataset.close === "true") {
        closeSaveModal();
    }
    });

    window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !saveModal.classList.contains("hidden")) {
        closeSaveModal();
    }
    });

    saveBtn.addEventListener("click", () => {
    const name = (fileLocation.value || "valo_output.png").trim();

    const dataUrl = document.getElementById("mainImage").src;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")
        ? name
        : `${name}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    closeSaveModal();
    });


    });