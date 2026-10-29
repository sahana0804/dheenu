const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const photoCards = [...document.querySelectorAll(".photo-card")];
const filterButtons = document.querySelectorAll(".filter-button");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.textContent = isOpen ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
    });
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        photoCards.forEach(card => {
            const matches = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("is-hidden", !matches);
        });
    });
});

let currentPhotoIndex = 0;
let lastFocusedElement = null;

function getVisiblePhotos() {
    return photoCards.filter(card => !card.classList.contains("is-hidden"));
}

function showPhoto(index) {
    const visiblePhotos = getVisiblePhotos();

    if (!visiblePhotos.length) return;

    currentPhotoIndex = (index + visiblePhotos.length) % visiblePhotos.length;

    const card = visiblePhotos[currentPhotoIndex];
    const image = card.querySelector("img");
    const fullImage = card.dataset.full || image.src;

    lightboxImage.src = fullImage;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = card.querySelector(".photo-overlay strong").textContent;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.classList.remove("no-scroll");

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

photoCards.forEach(card => {
    card.addEventListener("click", () => {
        lastFocusedElement = card;
        const visiblePhotos = getVisiblePhotos();
        const index = visiblePhotos.indexOf(card);
        showPhoto(index);
        lightboxClose.focus();
    });
});

lightboxClose.addEventListener("click", closeLightbox);

lightboxPrev.addEventListener("click", () => {
    showPhoto(currentPhotoIndex - 1);
});

lightboxNext.addEventListener("click", () => {
    showPhoto(currentPhotoIndex + 1);
});

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPhoto(currentPhotoIndex - 1);
    }

    if (event.key === "ArrowRight") {
        showPhoto(currentPhotoIndex + 1);
    }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => revealObserver.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}