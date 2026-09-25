/* =========================================================
   script.js — Josia Portfolio
   Modern Interactive System
   ========================================================= */


/* =========================================================
   1. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENT REFERENCES
       ===================================================== */

    const body = document.body;
    const navbar = document.getElementById("navbar");
    const scrollProgress = document.getElementById("scrollProgress");
    const themeToggle = document.getElementById("themeToggle");
    const backTop = document.getElementById("backTop");

    const langDropdown = document.querySelector(".lang-dropdown");
    const langBtn = document.querySelector(".lang-btn");
    const currentLangText = document.querySelector(".current-lang");
    const langOptions = document.querySelectorAll(".lang-option");

    const mainNav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll(".nav-link");

    const contactForm = document.getElementById("contactForm");


    /* =====================================================
       2. PRELOADER
       ===================================================== */

    window.addEventListener("load", () => {

        const preloader = document.getElementById("preloader");

        if (preloader) {

            setTimeout(() => {
                preloader.classList.add("hide");
            }, 500);

        }

    });


    /* =====================================================
       3. NAVBAR SCROLL + PROGRESS
       ===================================================== */

    function updateScrollUI() {

        const scrollY = window.scrollY;

        /* Navbar */

        if (navbar) {

            if (scrollY > 40) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        }


        /* Scroll Progress */

        if (scrollProgress) {

            const documentHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            if (documentHeight > 0) {

                const progress =
                    (scrollY / documentHeight) * 100;

                scrollProgress.style.width =
                    `${Math.min(progress, 100)}%`;

            }

        }


        /* Back To Top */

        if (backTop) {

            if (scrollY > 600) {
                backTop.classList.add("show");
            } else {
                backTop.classList.remove("show");
            }

        }

    }

    window.addEventListener(
        "scroll",
        updateScrollUI,
        { passive: true }
    );

    updateScrollUI();


    /* =====================================================
       4. REVEAL ANIMATION
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.08,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       5. DARK MODE
       ===================================================== */

    function updateThemeIcon() {

        if (!themeToggle) return;

        const isDark =
            body.classList.contains("dark-mode");

        themeToggle.innerHTML = isDark
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon-stars"></i>';

        themeToggle.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

    }


    const savedTheme =
        localStorage.getItem("josia-theme");

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
    }

    updateThemeIcon();


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            body.classList.toggle("dark-mode");

            const isDark =
                body.classList.contains("dark-mode");

            localStorage.setItem(
                "josia-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();

        });

    }


    /* =====================================================
       6. LANGUAGE SYSTEM
       ===================================================== */

    function updateLanguage(lang) {

        if (lang === "id") {

            body.classList.add("lang-indonesia");

            if (currentLangText) {
                currentLangText.textContent = "ID";
            }

        } else {

            body.classList.remove("lang-indonesia");

            if (currentLangText) {
                currentLangText.textContent = "EN";
            }

        }


        localStorage.setItem(
            "portfolio-lang",
            lang
        );


        /* Active option */

        langOptions.forEach(option => {

            const optionLang =
                option.getAttribute("data-lang");

            option.classList.toggle(
                "active",
                optionLang === lang
            );

        });


        /*
         * Restart visible typewriter
         * after language switching.
         */

        restartTypewriters();

    }


    const savedLanguage =
        localStorage.getItem("portfolio-lang") || "en";

    updateLanguage(savedLanguage);


    if (langBtn && langDropdown) {

        langBtn.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            langDropdown.classList.toggle(
                "active"
            );

        });


        langOptions.forEach(option => {

            option.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const selectedLang =
                        option.getAttribute(
                            "data-lang"
                        );

                    updateLanguage(
                        selectedLang
                    );

                    langDropdown.classList.remove(
                        "active"
                    );

                }
            );

        });


        document.addEventListener("click", event => {

            if (
                !langDropdown.contains(
                    event.target
                )
            ) {

                langDropdown.classList.remove(
                    "active"
                );

            }

        });

    }


    /* =====================================================
       7. TYPEWRITER
       ===================================================== */

    const typewriterInstances = [];


    class TypeWriter {

        constructor(
            element,
            words,
            period = 2000
        ) {

            this.element = element;
            this.words = words;
            this.period = parseInt(
                period,
                10
            ) || 2000;

            this.loopIndex = 0;
            this.text = "";
            this.isDeleting = false;
            this.timer = null;

            this.tick();

        }


        tick() {

            if (!this.element) return;

            const currentWord =
                this.words[
                    this.loopIndex %
                    this.words.length
                ];


            if (this.isDeleting) {

                this.text =
                    currentWord.substring(
                        0,
                        this.text.length - 1
                    );

            } else {

                this.text =
                    currentWord.substring(
                        0,
                        this.text.length + 1
                    );

            }


            this.element.innerHTML =
                `<span class="wrap">${this.text}</span>`;


            let speed =
                90 -
                Math.random() * 35;


            if (this.isDeleting) {
                speed /= 2;
            }


            if (
                !this.isDeleting &&
                this.text === currentWord
            ) {

                speed = this.period;
                this.isDeleting = true;

            } else if (
                this.isDeleting &&
                this.text === ""
            ) {

                this.isDeleting = false;
                this.loopIndex++;
                speed = 450;

            }


            this.timer =
                setTimeout(
                    () => this.tick(),
                    speed
                );

        }


        destroy() {

            if (this.timer) {
                clearTimeout(this.timer);
            }

        }

    }


    function destroyTypewriters() {

        typewriterInstances.forEach(
            instance => instance.destroy()
        );

        typewriterInstances.length = 0;

    }


    function restartTypewriters() {

        destroyTypewriters();


        const activeLanguage =
            body.classList.contains(
                "lang-indonesia"
            )
                ? "id"
                : "en";


        document
            .querySelectorAll(".typewrite")
            .forEach(element => {

                const parent =
                    element.closest(
                        ".lang-en, .lang-id"
                    );

                if (!parent) return;


                const parentIsVisible =
                    (
                        activeLanguage === "en" &&
                        parent.classList.contains(
                            "lang-en"
                        )
                    ) ||
                    (
                        activeLanguage === "id" &&
                        parent.classList.contains(
                            "lang-id"
                        )
                    );


                if (!parentIsVisible) return;


                const rawData =
                    element.getAttribute(
                        "data-type"
                    );

                if (!rawData) return;


                try {

                    const words =
                        JSON.parse(rawData);

                    const period =
                        element.getAttribute(
                            "data-period"
                        );


                    const instance =
                        new TypeWriter(
                            element,
                            words,
                            period
                        );


                    typewriterInstances.push(
                        instance
                    );

                } catch (error) {

                    console.warn(
                        "Typewriter error:",
                        error
                    );

                }

            });

    }


    /*
     * Start after page initialization.
     */

    setTimeout(
        restartTypewriters,
        150
    );


    /* =====================================================
       8. MOBILE NAV AUTO CLOSE
       ===================================================== */

    if (mainNav) {

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                if (
                    window.innerWidth < 992 &&
                    mainNav.classList.contains(
                        "show"
                    )
                ) {

                    const collapse =
                        bootstrap.Collapse.getInstance(
                            mainNav
                        );

                    if (collapse) {
                        collapse.hide();
                    }

                }

            });

        });

    }


    /* =====================================================
       9. ACTIVE NAVIGATION
       ===================================================== */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    function updateActiveNavigation() {

        const scrollPosition =
            window.scrollY + 280;

        let currentSection = "";


        sections.forEach(section => {

            const top =
                section.offsetTop;

            const height =
                section.offsetHeight;

            const id =
                section.getAttribute("id");


            if (
                scrollPosition >= top &&
                scrollPosition < top + height
            ) {

                currentSection = id;

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");


            if (
                href ===
                `#${currentSection}`
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();


    /* =====================================================
       10. COUNTER ANIMATION
       ===================================================== */

    const counters =
        document.querySelectorAll(
            "[data-count]"
        );


    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        let counterStarted = false;


        const counterObserver =
            new IntersectionObserver(
                entries => {

                    if (
                        entries[0].isIntersecting &&
                        !counterStarted
                    ) {

                        counterStarted = true;


                        counters.forEach(counter => {

                            const target =
                                parseInt(
                                    counter.dataset.count,
                                    10
                                ) || 0;

                            const duration = 1200;

                            const startTime =
                                performance.now();


                            function animate(
                                currentTime
                            ) {

                                const elapsed =
                                    currentTime -
                                    startTime;

                                const progress =
                                    Math.min(
                                        elapsed /
                                        duration,
                                        1
                                    );


                                /*
                                 * Ease out.
                                 */

                                const eased =
                                    1 -
                                    Math.pow(
                                        1 - progress,
                                        3
                                    );


                                const value =
                                    Math.floor(
                                        eased *
                                        target
                                    );


                                counter.textContent =
                                    `+${value}`;


                                if (
                                    progress < 1
                                ) {

                                    requestAnimationFrame(
                                        animate
                                    );

                                } else {

                                    counter.textContent =
                                        `+${target}`;

                                }

                            }


                            requestAnimationFrame(
                                animate
                            );

                        });


                        counterObserver.disconnect();

                    }

                },
                {
                    threshold: 0.35
                }
            );


        counterObserver.observe(
            counters[0]
        );

    }


    /* =====================================================
       11. BACK TO TOP
       ===================================================== */

    if (backTop) {

        backTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       12. WHATSAPP CONTACT FORM
       ===================================================== */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document
                        .getElementById("name")
                        ?.value
                        .trim() || "";


                const email =
                    document
                        .getElementById("email")
                        ?.value
                        .trim() || "";


                const message =
                    document
                        .getElementById("message")
                        ?.value
                        .trim() || "";


                if (
                    !name ||
                    !email ||
                    !message
                ) {

                    return;

                }


                const whatsappMessage =
                    `Halo Josia,\n\n` +
                    `Nama: ${name}\n` +
                    `Email: ${email}\n\n` +
                    `Pesan:\n${message}`;


                const whatsappURL =
                    `https://wa.me/6281241776292?text=` +
                    encodeURIComponent(
                        whatsappMessage
                    );


                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* =====================================================
       13. MAGNETIC HOVER — DESKTOP ONLY
       ===================================================== */

    const finePointer =
        window.matchMedia(
            "(pointer:fine)"
        ).matches;


    if (finePointer) {

        const magneticElements =
            document.querySelectorAll(
                ".magnetic"
            );


        magneticElements.forEach(element => {

            element.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        element.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    element.style.transform =
                        `translate(${x * 0.08}px, ${y * 0.08}px)`;

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    element.style.transform =
                        "";

                }
            );

        });

    }


    /* =====================================================
       14. CURSOR SUPPORT
       ===================================================== */

    const cursorDot =
        document.querySelector(
            "[data-cursor-dot]"
        );

    const cursorOutline =
        document.querySelector(
            "[data-cursor-outline]"
        );


    if (
        finePointer &&
        cursorDot &&
        cursorOutline
    ) {

        let mouseX =
            window.innerWidth / 2;

        let mouseY =
            window.innerHeight / 2;

        let outlineX =
            mouseX;

        let outlineY =
            mouseY;


        window.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;


                cursorDot.style.left =
                    `${mouseX}px`;

                cursorDot.style.top =
                    `${mouseY}px`;

            }
        );


        function renderCursor() {

            outlineX +=
                (mouseX - outlineX) *
                0.18;

            outlineY +=
                (mouseY - outlineY) *
                0.18;


            cursorOutline.style.left =
                `${outlineX}px`;

            cursorOutline.style.top =
                `${outlineY}px`;


            requestAnimationFrame(
                renderCursor
            );

        }


        requestAnimationFrame(
            renderCursor
        );


        const interactables =
            document.querySelectorAll(
                "a, button, input, textarea, .project-row"
            );


        interactables.forEach(item => {

            item.addEventListener(
                "mouseenter",
                () => {

                    cursorOutline.classList.add(
                        "hovering"
                    );

                }
            );


            item.addEventListener(
                "mouseleave",
                () => {

                    cursorOutline.classList.remove(
                        "hovering"
                    );

                }
            );

        });

    }


    /* =====================================================
       15. ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                langDropdown
            ) {

                langDropdown.classList.remove(
                    "active"
                );

            }

        }
    );

});
