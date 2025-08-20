const sections = document.querySelectorAll("section");
let isScrolling = false;

// Detect if mobile/tablet
function isMobileOrTablet() {
  return (
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.innerWidth < 1024
  ); // width-based fallback
}

// Easing function
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Smooth scroll animation
function scrollToSection(targetY) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = 900; // ms
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      isScrolling = false;
    }
  }

  requestAnimationFrame(animation);
}

// Button click scroll
document.getElementById("scrollBtn")?.addEventListener("click", function () {
  const target = document.getElementById("projects");
  scrollToSection(target.offsetTop);
});
// Only enable snapping on desktop
if (!isMobileOrTablet()) {
  // Wheel scroll snapping
  window.addEventListener(
    "wheel",
    function (e) {
      if (isScrolling) return;
      isScrolling = true;

      const currentSectionIndex = [...sections].findIndex(
        (sec) =>
          window.scrollY >= sec.offsetTop - 50 &&
          window.scrollY < sec.offsetTop + sec.offsetHeight - 50
      );

      if (e.deltaY > 0 && currentSectionIndex < sections.length - 1) {
        // Scroll down
        scrollToSection(sections[currentSectionIndex + 1].offsetTop);
      } else if (e.deltaY < 0 && currentSectionIndex > 0) {
        // Scroll up
        scrollToSection(sections[currentSectionIndex - 1].offsetTop);
      } else {
        isScrolling = false;
      }
    },
    { passive: false }
  );
} else {
  // Mobile/tablet → native scroll, disable snapping
  document.documentElement.style.scrollBehavior = "auto";
}


const scriptURL =
  "https://script.google.com/macros/s/AKfycbx2qzO98SK3TkPQsrFgDpTKjzx5tcp_phXjGR9PWVo05jBCFKWk7PsxxVHPNWtF_Y8GGg/exec";

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitBtn = form.querySelector("button[type='submit']");

// Regex rules
const nameRegex = /^[A-Za-z\s]+$/; // only letters & spaces
const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/; // must contain @ and .domain

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = form.querySelector("input[name='name']").value.trim();
  const email = form.querySelector("input[name='email']").value.trim();
  const message = form.querySelector("textarea[name='message']").value.trim();

  // ===== Validation =====
  if (!nameRegex.test(name)) {
    statusEl.innerHTML = "⚠️ Name should contain only letters (no numbers).";
    statusEl.style.color = "orange";
    return;
  }

  if (!emailRegex.test(email)) {
    statusEl.innerHTML =
      "⚠️ Please enter a valid email (must contain @ and . like test@mail.com).";
    statusEl.style.color = "orange";
    return;
  }

  if (message.length < 5) {
    statusEl.innerHTML = "⚠️ Message should be at least 5 characters long.";
    statusEl.style.color = "orange";
    return;
  }

  // Show loader inside button
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Sending...`;

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: new FormData(form),
    });

    if (response.ok) {
      statusEl.innerHTML = "✅ Message sent successfully!";
      statusEl.style.color = "limegreen";
      form.reset();
    } else {
      statusEl.innerHTML = "❌ Something went wrong. Try again.";
      statusEl.style.color = "red";
    }
  } catch (error) {
    statusEl.innerHTML = "⚠️ Network error. Please try again.";
    statusEl.style.color = "orange";
  } finally {
    // Reset button back to normal
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Send Message";
  }
});

const resumeBtn = document.getElementById("resumeBtn");
const resumeBtnText = document.getElementById("resumeBtnText");

// Replace this with your Google Drive direct download link
const resumeURL = (href =
  "https://drive.google.com/file/d/1XfqzTrwxGT40G12KPNhsU1zNhMuPuhgy/view?usp=sharing");
resumeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Show loader (reuse Bootstrap spinner style)
  resumeBtn.disabled = true;
  resumeBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Loading...`;

  setTimeout(() => {
    // Open in new tab
    window.open(resumeURL, "_blank");

    // Reset button back to normal
    resumeBtn.disabled = false;
    resumeBtn.innerHTML = `<span id="resumeBtnText">Download Resume</span>`;
  }, 1200); // delay so spinner shows for a moment
});

document.querySelectorAll(".project-card").forEach((card) => {
  const bg = card.getAttribute("data-bg");
  if (bg) {
    card.style.setProperty("--bg-image", `url(${bg})`);
    card.querySelector("::before");
    card.style.backgroundImage = `url(${bg})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
  }
});

document.querySelectorAll(".modal").forEach((modal) => {
  const modalDialog = modal.querySelector(".modal-dialog");

  modal.addEventListener("shown.bs.modal", () => {
    document.body.style.overflow = "hidden";

    // prevent background scroll when scrolling inside modal
    modalDialog.addEventListener("wheel", function (e) {
      const delta = e.deltaY;
      const content = modal.querySelector(".modal-body");

      if (
        (delta > 0 &&
          content.scrollHeight - content.scrollTop <= content.clientHeight) ||
        (delta < 0 && content.scrollTop === 0)
      ) {
        e.preventDefault(); // block page scroll
      }
    });
  });

  modal.addEventListener("hidden.bs.modal", () => {
    document.body.style.overflow = "auto";
  });
});

// ====================================
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* Switch to pointer cursor when hovering links/buttons */
const interactiveEls = document.querySelectorAll(
  "a, button, .btn, .card ,.project-card ,.extra-card"
);

interactiveEls.forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("pointer"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("pointer"));
});

// ============Pre Loader============
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 1500); // small delay for smooth fade
});

