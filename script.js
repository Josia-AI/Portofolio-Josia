/* =========================================================
   script.js — Animasi Interaktif
   ========================================================= */

/* 1. PRELOADER */
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => preloader.classList.add("hide"), 600);
    }
});

/* 2. NAVBAR & SCROLL PROGRESS */
const navbar = document.getElementById("navbar");
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;
    
    if (navbar) {
        if (scrollY > 50) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
    }

    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;
        scrollProgress.style.width = progress + "%";
    }
});

/* 3. REVEAL ANIMATION SAAT SCROLL */
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

/* =========================================================
   4. THEME & MODERN LANGUAGE DROPDOWN
   ========================================================= */
// Theme Logic
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    if (localStorage.getItem("josia-theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
    }
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("josia-theme", isDark ? "dark" : "light");
        themeToggle.innerHTML = isDark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    });
}

// Dropdown Language Logic
const langDropdown = document.querySelector('.lang-dropdown');
const langBtn = document.querySelector('.lang-btn');
const currentLangText = document.querySelector('.current-lang');
const langOptions = document.querySelectorAll('.lang-option');

if (langDropdown && langBtn) {
    // Buka/Tutup menu saat tombol ditekan
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });

    // Tutup menu jika klik di luar dropdown
    document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target)) {
            langDropdown.classList.remove('active');
        }
    });

    // Fungsi mengganti bahasa
    function updateLanguage(lang) {
        if (lang === "id") {
            document.body.classList.add("lang-indonesia");
            currentLangText.textContent = "ID";
        } else {
            document.body.classList.remove("lang-indonesia");
            currentLangText.textContent = "EN";
        }
        localStorage.setItem("portfolio-lang", lang);

        // Ubah warna active pada menu
        langOptions.forEach(opt => {
            if(opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    // Set bahasa dari penyimpanan lokal saat halaman dimuat
    const savedLang = localStorage.getItem("portfolio-lang") || "en";
    updateLanguage(savedLang);

    // Ganti bahasa ketika menu dipilih
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang');
            updateLanguage(selectedLang);
            langDropdown.classList.remove('active');
        });
    });
}

/* 5. EFEK KETIKAN (TYPEWRITER) */
class TypeWriter {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }
    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) this.txt = fullTxt.substring(0, this.txt.length - 1);
        else this.txt = fullTxt.substring(0, this.txt.length + 1);

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        let delta = 100 - Math.random() * 50;
        if (this.isDeleting) delta /= 2;

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }
        setTimeout(() => this.tick(), delta);
    }
}

window.addEventListener('load', () => {
    const elements = document.getElementsByClassName('typewrite');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-type');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) new TypeWriter(elements[i], JSON.parse(toRotate), period);
    }
});

/* 6. MAGNETIC CUSTOM CURSOR (HALUS) */
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

if (matchMedia('(pointer:fine)').matches && cursorDot && cursorOutline) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
        outlineX += (mouseX - outlineX) * 0.2; 
        outlineY += (mouseY - outlineY) * 0.2;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    const interactables = document.querySelectorAll("a, button, input, textarea, .project-row");
    interactables.forEach(item => {
        item.addEventListener("mouseenter", () => cursorOutline.classList.add("hovering"));
        item.addEventListener("mouseleave", () => cursorOutline.classList.remove("hovering"));
    });
}

/* 7. COUNTERS ANGKA BERJALAN */
const counters = document.querySelectorAll("[data-count]");
if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            counters.forEach(counter => {
                const target = +counter.dataset.count;
                let current = 0;
                const increment = Math.max(1, Math.ceil(target / 40));
                const update = () => {
                    current += increment;
                    if (current >= target) { counter.innerText = "+" + target; return; }
                    counter.innerText = "+" + current;
                    requestAnimationFrame(update);
                };
                update();
            });
            counterObserver.disconnect();
        }
    }, { threshold: 0.5 });
    counterObserver.observe(counters[0]);
}

/* 8. ACTIVE NAV MENU */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 250) current = sec.getAttribute("id");
    });
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) link.classList.add("active");
    });
});

/* 9. BACK TO TOP BUTTON */
const backTop = document.getElementById("backTop");
if (backTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 600) backTop.classList.add("show");
        else backTop.classList.remove("show");
    });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* 10. WHATSAPP FORM */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = `Halo Josia,%0A%0ANama: ${encodeURIComponent(document.getElementById("name").value.trim())}%0AEmail: ${encodeURIComponent(document.getElementById("email").value.trim())}%0A%0APesan:%0A${encodeURIComponent(document.getElementById("message").value.trim())}`;
        window.open(`https://wa.me/6281241776292?text=${msg}`, "_blank");
    });
}