/*
=========================================================
                    MAIN JAVASCRIPT
                      आसान हिंदी में
JavaScript वेबसाइट को चलने वाले काम देता है:
menu खोलना, theme बदलना, FAQ खोलना और form से WhatsApp संदेश बनाना ।
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1) Loading screen: पेज लोड होने के बाद loading layer हटा दें।
    const loader = document.getElementById("loader-screen");
    const hideLoader = () => {
        if (!loader) return;
        loader.classList.add("hidden");
        // CSS animation खत्म होने के बाद इसे पूरी तरह हटा देते हैं।
        window.setTimeout(() => { loader.style.display = "none"; }, 550);
    };

    window.addEventListener("load", hideLoader, { once: true });
    // अगर कोई image/font धीरे load हो, तो loader हमेशा के लिए नहीं रुकेगा।
    window.setTimeout(hideLoader, 1600);

    // 2) Theme: dark/light चुनने पर choice browser में save हो जाती है।
    const themeButton = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("portfolio-theme", next);
        });
    }

    // 3) Custom cursor: mouse वाले devices पर ही छोटा dot दिखाएँ।
    const dot = document.getElementById("cursor-dot");
    const outline = document.getElementById("cursor-outline");
    if (dot && outline) {
        // Default me visual pointer logic system hiding enabled based on user hardware configurations.
        dot.style.display = "none";
        outline.style.display = "none";
    }

    // 4) Scroll: header छोटा होता है और सही navigation link highlight होता है।
    const header = document.getElementById("header");
    const backToTop = document.getElementById("back-to-top");
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const onScroll = () => {
        if (header) header.classList.toggle("scrolled", window.scrollY > 35);
        if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 450);

        let currentId = "";
        sections.forEach(section => {
            if (window.scrollY >= (section.offsetTop - 150)) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 5) Mobile menu: hamburger पर क्लिक करने से menu खुलता या बंद होता है।
    const mobileButton = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (mobileButton && navMenu) {
        mobileButton.addEventListener("click", () => {
            const opened = navMenu.classList.toggle("open");
            mobileButton.setAttribute("aria-expanded", String(opened));
        });
    }

    // किसी menu link को दबाते ही mobile menu बंद कर दें।
    navLinks.forEach(link => link.addEventListener("click", () => {
        if (navMenu && mobileButton) {
            navMenu.classList.remove("open");
            mobileButton.setAttribute("aria-expanded", "false");
        }
    }));

    // 6) Portfolio filter: category button दबाने पर बाकी cards छिपते हैं।
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".portfolio-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");

            const selected = button.dataset.filter;
            projectCards.forEach(card => {
                const category = card.dataset.category;
                const shouldShow = (selected === "all" || category === selected);
                // Toggle display style safely to respect user query choice while keeping images robust.
                card.classList.toggle("is-hidden", !shouldShow);
            });
        });
    });

    // 7) FAQ: सवाल पर क्लिक करने से उसका जवाब खुलता है।
    document.querySelectorAll(".faq-question").forEach(question => {
        question.addEventListener("click", () => {
            const item = question.closest(".faq-item");
            const wasOpen = item.classList.contains("active");

            // पहले बाकी सभी answers बंद कर दो।
            document.querySelectorAll(".faq-item").forEach(other => {
                other.classList.remove("active");
                const otherButton = other.querySelector(".faq-question");
                if (otherButton) otherButton.setAttribute("aria-expanded", "false");
            });

            // अगर clicked answer पहले बंद था, तो उसे खोल दो।
            if (!wasOpen) {
                item.classList.add("active");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });

    // 8) Reveal: section स्क्रीन पर आने पर हल्का animation चलता है।
    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => observer.observe(item));
    } else {
        // पुराने browser में animation न चले तो भी content दिखना चाहिए।
        revealItems.forEach(item => item.classList.add("active"));
    }

    // 9) Back to top: button दबाने पर पेज smooth तरीके से ऊपर जाता है।
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 10) Plan या project पर click करने से contact form में सही option चुन जाता है।
    const projectType = document.getElementById("project-type");
    document.querySelectorAll("[data-plan]").forEach(button => {
        button.addEventListener("click", () => {
            const plan = button.dataset.plan;
            if (projectType) {
                // select dropdown option correctly
                for (let i = 0; i < projectType.options.length; i++) {
                    if (projectType.options[i].text.includes(plan)) {
                        projectType.selectedIndex = i;
                        break;
                    }
                }
                // अगर plan के नाम से exact option नहीं है, तो message में plan लिखें।
                const message = document.getElementById("message");
                if (message) message.value = `I'm interested in the ${plan}. Please share the final scope and quote.`;
            }
        });
    });

    document.querySelectorAll("[data-project]").forEach(link => {
        link.addEventListener("click", () => {
            const message = document.getElementById("message");
            if (message) message.value = `I'm interested in a project similar to: ${link.dataset.project}.`;
        });
    });

    // 11) WhatsApp enquiry form.
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault(); // Form submit होकर page reload न करे.

            // IMPORTANT: यहाँ अपना WhatsApp number डालें। (Example: "919876543210")
            const WHATSAPP_NUMBER = "917002596681"; 

            if (WHATSAPP_NUMBER.includes("X")) {
                alert("पहले js/main.js में WHATSAPP_NUMBER की जगह अपना WhatsApp number डालें।");
                return;
            }

            const data = new FormData(form);
            const message = [
                "Hello! I want to discuss a website project.",
                `Name: ${data.get("name")}`,
                `Business: ${data.get("business")}`,
                `Email / Phone: ${data.get("email")}`,
                `Website type: ${data.get("project-type")}`,
                `Details: ${data.get("message") || "Not provided"}`
            ].join("\n");

            // WhatsApp में message पहले से लिखा हुआ खुलेगा; user खुद Send दबाएगा।
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, "_blank", "noopener, noreferrer");
        });
    }

    // 12) Footer में current year अपने आप दिखेगा।
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
});