// Bi_Bi's Cakes - JavaScript

document.addEventListener("DOMContentLoaded", () => {

    // 1. Mobile Navigation
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav, header nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("open");
        });
    }

    // 2. FAQ Accordion
    document.querySelectorAll(".accordion-trigger").forEach(button => {
        button.addEventListener("click", () => {
            const panel = button.nextElementSibling;

            if (panel) {
                panel.hidden = !panel.hidden;
            }
        });
    });

    // 3. Cupcake Search
    const search = document.querySelector("#cupcake-search");
    const cards = document.querySelectorAll(".menu-item, .product-card");

    if (search) {
        search.addEventListener("input", () => {
            const value = search.value.toLowerCase();

            cards.forEach(card => {
                const cardName = (
                    card.dataset.name ||
                    card.textContent ||
                    ""
                ).toLowerCase();

                card.hidden = !cardName.includes(value);
            });
        });
    }

    // 4. Form Validation
    function validateForm(form, errorBox) {

        if (!form.checkValidity()) {
            errorBox.textContent = "Please complete all required fields correctly.";
            form.reportValidity();
            return false;
        }

        errorBox.textContent = "";
        return true;
    }

    // 5. AJAX Form Submission
    async function submitForm(form, feedback, errors, button, data) {

        // The supplied HTML forms do not currently have a submission URL.
        // Do not send a request to the current page or display a false success message.
        if (!form.hasAttribute("action") || !form.getAttribute("action").trim()) {
            errors.textContent =
                "Your form is valid, but online submission has not been configured yet. " +
                "Please contact info@bibiscakes.co.za to submit your enquiry.";
            return;
        }

        const originalButtonText = button.tagName === "INPUT"
            ? button.value
            : button.textContent;

        button.disabled = true;

        if (button.tagName === "INPUT") {
            button.value = "Sending...";
        } else {
            button.textContent = "Sending...";
        }

        feedback.textContent = "";
        errors.textContent = "";

        try {
            const response = await fetch(form.getAttribute("action"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error("Unable to send your message. Please try again.");
            }

            feedback.textContent = "Thank you! Your message has been submitted successfully.";

            form.reset();

        } catch (error) {
            errors.textContent = "Error: " + error.message;

        } finally {
            button.disabled = false;

            if (button.tagName === "INPUT") {
                button.value = originalButtonText;
            } else {
                button.textContent = originalButtonText;
            }
        }
    }

    // 6. Enquiry Form
    // Matches the existing custom.html form and its actual field names.
    const enquiryForm = Array.from(
        document.querySelectorAll(".form-section form")
    ).find(form => form.elements.namedItem("quantity"));

    if (enquiryForm) {
        const errors = document.createElement("p");
        errors.id = "enquiry-errors";
        errors.setAttribute("role", "alert");

        const feedback = document.createElement("p");
        feedback.id = "enquiry-feedback";
        feedback.setAttribute("role", "status");

        enquiryForm.append(errors, feedback);

        enquiryForm.addEventListener("submit", async event => {

            event.preventDefault();

            if (!validateForm(enquiryForm, errors)) return;

            const button = enquiryForm.querySelector(
                'button[type="submit"], input[type="submit"]'
            );

            if (!button) {
                errors.textContent = "The form submit button could not be found.";
                return;
            }

            const formData = new FormData(enquiryForm);

            const data = {
                _subject: "New Cupcake Enquiry",
                _template: "table",
                name: formData.get("name"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                event: formData.get("event"),
                quantity: Number(formData.get("quantity")),
                date: formData.get("date"),
                design: formData.get("design")
            };

            await submitForm(
                enquiryForm,
                feedback,
                errors,
                button,
                data
            );
        });
    }

    // 7. Contact Form
    // Matches the existing contact.html form and its actual field names.
    const contactForm = Array.from(
        document.querySelectorAll(".form-section form")
    ).find(form => form.elements.namedItem("contactName"));

    if (contactForm) {
        const errors = document.createElement("p");
        errors.id = "contact-errors";
        errors.setAttribute("role", "alert");

        const feedback = document.createElement("p");
        feedback.id = "contact-feedback";
        feedback.setAttribute("role", "status");

        contactForm.append(errors, feedback);

        contactForm.addEventListener("submit", async event => {

            event.preventDefault();

            if (!validateForm(contactForm, errors)) return;

            const button = contactForm.querySelector(
                'button[type="submit"], input[type="submit"]'
            );

            if (!button) {
                errors.textContent = "The form submit button could not be found.";
                return;
            }

            const formData = new FormData(contactForm);

            const data = {
                _subject: "New Website Contact Message",
                _template: "table",
                name: formData.get("contactName"),
                email: formData.get("contactEmail"),
                message: formData.get("message")
            };

            await submitForm(
                contactForm,
                feedback,
                errors,
                button,
                data
            );
        });
    }

    // 8. Image Gallery
    const galleryImages = document.querySelectorAll(".gallery-image");
    const lightbox = document.getElementById("lightbox");

    galleryImages.forEach(image => {
        image.addEventListener("click", () => {

            if (lightbox) {
                const largeImage = lightbox.querySelector("img");

                if (largeImage) {
                    largeImage.src = image.src;
                    largeImage.alt = image.alt;

                    lightbox.hidden = false;
                }
            }
        });
    });

    if (lightbox) {
        const closeButton = lightbox.querySelector(".lightbox-close");

        closeButton?.addEventListener("click", () => {
            lightbox.hidden = true;
        });
    }

});