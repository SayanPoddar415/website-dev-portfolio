/* Cart And Order — navigation, validation, and inquiry submission. */
"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

// Highlight the selected Buyer/Seller role in the inquiry form.
document.querySelectorAll('input[name="role"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    document.querySelectorAll(".role-option").forEach((label) => {
      label.classList.toggle("selected", label.querySelector("input").checked);
    });
  });
});

// Keep the inquiry character count in sync with the textarea.
const inquiryField = document.getElementById("inquiry");
const charCount = document.getElementById("char-count");
if (inquiryField && charCount) {
  inquiryField.addEventListener("input", () => {
    charCount.textContent = `${inquiryField.value.length} / 500`;
  });
}

const form = document.getElementById("inquiry-form");
const statusMessage = document.getElementById("form-status");
const submitButton = document.getElementById("submit-button");
const consent = document.getElementById("consent");

// IMPORTANT: Add your deployed Google Apps Script Web App URL here.
// Do not place private API keys or credentials in frontend JavaScript.
const GOOGLE_APPS_SCRIPT_URL = ""; // Example: "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"

function setError(input, message) {
  const field = input.closest(".form-field");
  const error = field ? field.querySelector(".field-error") : null;
  if (error) error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((node) => { node.textContent = ""; });
  document.querySelectorAll('[aria-invalid="true"]').forEach((node) => node.removeAttribute("aria-invalid"));
}

function isValidContact(value) {
  const trimmed = value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Accept international phone numbers with common formatting characters.
  const phonePattern = /^\+?[0-9\s().-]{7,20}$/;
  return emailPattern.test(trimmed) || phonePattern.test(trimmed);
}

function validateForm() {
  clearErrors();
  let valid = true;

  const fullName = document.getElementById("full-name");
  const contactInfo = document.getElementById("contact-info");
  const inquiry = document.getElementById("inquiry");

  if (!fullName.value.trim()) {
    setError(fullName, "Please enter your full name.");
    valid = false;
  }

  if (!contactInfo.value.trim()) {
    setError(contactInfo, "Please enter a phone number or email.");
    valid = false;
  } else if (!isValidContact(contactInfo.value)) {
    setError(contactInfo, "Enter a valid email address or phone number.");
    valid = false;
  }

  if (!inquiry.value.trim()) {
    setError(inquiry, "Please describe your business inquiry.");
    valid = false;
  }

  const consentError = document.getElementById("consent-error");
  if (!consent.checked) {
    consentError.textContent = "Please agree to be contacted about this inquiry.";
    valid = false;
  }

  return valid;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusMessage.textContent = "";
  statusMessage.className = "form-status";

  if (!validateForm()) {
    statusMessage.textContent = "Please review the highlighted fields.";
    statusMessage.classList.add("error");
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const payload = {
    fullName: document.getElementById("full-name").value.trim(),
    contactInfo: document.getElementById("contact-info").value.trim(),
    role: form.querySelector('input[name="role"]:checked').value,
    businessName: document.getElementById("business-name").value.trim(),
    inquiry: inquiryField.value.trim(),
    consent: consent.checked,
    submittedAt: new Date().toISOString()
  };

  // Without a configured backend, don't pretend the inquiry was sent.
  if (!GOOGLE_APPS_SCRIPT_URL) {
    statusMessage.textContent = "The form is ready, but submission is not connected yet. Add your Google Apps Script URL in script.js.";
    statusMessage.classList.add("error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";

  try {
    // Apps Script Web Apps commonly require no-cors mode for browser form POSTs.
    // In no-cors mode the browser cannot read the response, so this only confirms
    // that the request was dispatched—not that the server accepted the data.
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams(payload).toString()
    });

    form.reset();
    document.querySelectorAll(".role-option").forEach((label) => {
      label.classList.toggle("selected", label.querySelector("input").checked);
    });
    charCount.textContent = "0 / 500";
    statusMessage.textContent = "Your inquiry has been submitted. Thank you for contacting Cart And Order.";
    statusMessage.classList.add("success");
  } catch (error) {
    console.error("Inquiry submission failed:", error);
    statusMessage.textContent = "We couldn’t send your inquiry. Please try again or contact us directly.";
    statusMessage.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send Inquiry <span aria-hidden="true">→</span>';
  }
});

// Download button: change this to your actual Android app URL before publishing.
document.getElementById("download-app-link").addEventListener("click", (event) => {
  const downloadUrl = ""; // Replace with Play Store listing or direct download URL.
  if (downloadUrl) {
    event.preventDefault();
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  } else {
    // No fake download action: keep the visitor informed until the app link exists.
    event.preventDefault();
    alert("The Cart And Order app download link will be available here soon.");
  }
});
