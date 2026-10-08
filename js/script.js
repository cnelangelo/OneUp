
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // ONEUP REAL ESTATE - MAIN SCRIPT
  // ==========================================

  const grid = document.getElementById("property-grid");
  const locationFilter = document.getElementById("location");
  const minInput = document.getElementById("min-price");
  const maxInput = document.getElementById("max-price");
  const bedroomFilter = document.getElementById("bedrooms");
  const sortSelect = document.getElementById("sort");
  const resultCount = document.getElementById("result-count");
  const resetButton = document.getElementById("reset-filters");

  // Property modal
  const modal = document.getElementById("property-modal");
  const closeModal = document.getElementById("close-modal");
  const modalImage = document.getElementById("modal-image");
  const modalThumbnails = document.getElementById("modal-thumbnails");
  const modalTitle = document.getElementById("modal-title");
  const modalLocation = document.getElementById("modal-location");
  const modalPrice = document.getElementById("modal-price");
  const modalFeatures = document.getElementById("modal-features");
  const modalDescription = document.getElementById("modal-description");
  const modalContact = document.getElementById("modal-contact");
  const modalPhone = document.getElementById("modal-phone");
  const modalWhatsApp = document.getElementById("modal-whatsapp");

  // Replace these with your contact information
  const contactEmail = "your-email@example.com";
  const contactPhone = "+639XXXXXXXXX";
  const whatsappNumber = "639XXXXXXXXX";

  const formatPrice = price =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0
    }).format(price);

  // ==========================================
  // PROPERTY DETAILS AND PHOTO GALLERY
  // ==========================================

  function openProperty(property) {
    if (!modal || !modalImage || !modalThumbnails) return;

    const photos = property.images?.length
      ? property.images
      : property.image
        ? [property.image]
        : [];

    modalThumbnails.replaceChildren();

    // Main image
    if (photos.length) {
      modalImage.src = photos[0];
      modalImage.alt = `${property.name} exterior photo`;
    } else {
      modalImage.removeAttribute("src");
      modalImage.alt = "No property photo available";
    }

    // Only show additional photos as thumbnails.
    // The first photo is already the main image.
    photos.slice(1).forEach((photo, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute(
        "aria-label",
        `View property photo ${index + 2}`
      );

      const thumbnail = document.createElement("img");
      thumbnail.src = photo;
      thumbnail.alt = "";
      thumbnail.loading = "lazy";

      button.appendChild(thumbnail);

      button.addEventListener("click", () => {
        modalImage.src = photo;
        modalImage.alt = `${property.name} photo ${index + 2}`;

        modalThumbnails
          .querySelectorAll("button")
          .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");
      });

      modalThumbnails.appendChild(button);
    });

    if (modalTitle) modalTitle.textContent = property.name;
    if (modalLocation) modalLocation.textContent = property.location;
    if (modalPrice) modalPrice.textContent = formatPrice(property.price);

    if (modalFeatures) {
      modalFeatures.replaceChildren();

      const features = [
        `${property.bedrooms} Bedrooms`,
        `${property.bathrooms} Bathrooms`,
        `${property.area} sqm Floor Area`
      ];

      features.forEach(feature => {
        const item = document.createElement("div");
        item.className = "modal-feature";
        item.textContent = feature;
        modalFeatures.appendChild(item);
      });
    }

    if (modalDescription) {
      modalDescription.textContent =
        property.description ||
        "Discover comfortable, modern living in this property.";
    }

    const message =
      `Hello OneUp Real Estate,\n\n` +
      `I would like to inquire about ${property.name}.\n` +
      `Location: ${property.location}\n` +
      `Price: ${formatPrice(property.price)}\n\n` +
      `Please share more information.\n\nThank you.`;

    if (modalContact) {
      modalContact.href =
        `mailto:${contactEmail}?subject=${encodeURIComponent(
          `Property Inquiry - ${property.name}`
        )}&body=${encodeURIComponent(message)}`;
    }

    if (modalPhone) {
      modalPhone.href = `tel:${contactPhone}`;
    }

    if (modalWhatsApp) {
      modalWhatsApp.href =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    if (!modal.open) modal.showModal();
  }

  // Close modal
  if (modal) {
    closeModal?.addEventListener("click", () => modal.close());

    modal.addEventListener("click", event => {
      if (event.target === modal) modal.close();
    });
  }

  // ==========================================
  // PROPERTY FILTERING AND SORTING
  // ==========================================

  const propertyData =
    typeof properties !== "undefined" ? properties : [];

  if (
    grid &&
    locationFilter &&
    minInput &&
    maxInput &&
    bedroomFilter &&
    sortSelect
  ) {
    const locations = [
      ...new Set(propertyData.map(property => property.location))
    ];

    locations.sort().forEach(location => {
      const option = document.createElement("option");
      option.value = location;
      option.textContent = location;
      locationFilter.appendChild(option);
    });

    function renderProperties() {
      const selectedLocation = locationFilter.value;
      const minPrice = minInput.value === "" ? 0 : Number(minInput.value);
      const maxPrice = maxInput.value === "" ? Infinity : Number(maxInput.value);
      const bedrooms = bedroomFilter.value === "" ? 0 : Number(bedroomFilter.value);

      let filtered = propertyData.filter(property => {
        return (
          (!selectedLocation || property.location === selectedLocation) &&
          property.price >= minPrice &&
          property.price <= maxPrice &&
          property.bedrooms >= bedrooms
        );
      });

      if (sortSelect.value === "low") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortSelect.value === "high") {
        filtered.sort((a, b) => b.price - a.price);
      }

      grid.replaceChildren();

      if (resultCount) {
        resultCount.textContent =
          `${filtered.length} ${filtered.length === 1 ? "property" : "properties"} found`;
      }

      if (!filtered.length) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "no-results";
        emptyMessage.textContent =
          "No properties match your filters. Try adjusting your search.";
        grid.appendChild(emptyMessage);
        return;
      }

      filtered.forEach(property => {
        const card = document.createElement("article");
        card.className = "property-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute(
          "aria-label",
          `View details for ${property.name}`
        );

        const image = document.createElement("img");
        image.src = property.images?.[0] || property.image || "";
        image.alt = `${property.name} property photo`;
        image.loading = "lazy";

        const info = document.createElement("div");
        info.className = "property-info";

        const title = document.createElement("h3");
        title.textContent = property.name;

        const location = document.createElement("p");
        location.className = "property-location";
        location.textContent = property.location;

        const price = document.createElement("p");
        price.className = "property-price";
        price.textContent = formatPrice(property.price);

        const features = document.createElement("p");
        features.className = "property-features";
        features.textContent =
          `${property.bedrooms} Bedrooms · ` +
          `${property.bathrooms} Bathrooms · ` +
          `${property.area} sqm Floor Area`;

        const viewDetails = document.createElement("p");
        viewDetails.className = "view-details";
        viewDetails.textContent = "View Property Details →";

        info.append(title, location, price, features, viewDetails);
        card.append(image, info);

        card.addEventListener("click", () => openProperty(property));

        card.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProperty(property);
          }
        });

        grid.appendChild(card);
      });
    }

    [locationFilter, bedroomFilter, sortSelect].forEach(element => {
      element.addEventListener("change", renderProperties);
    });

    [minInput, maxInput].forEach(element => {
      element.addEventListener("input", renderProperties);
    });

    resetButton?.addEventListener("click", () => {
      locationFilter.value = "";
      minInput.value = "";
      maxInput.value = "";
      bedroomFilter.value = "";
      sortSelect.value = "default";
      renderProperties();
    });

    renderProperties();
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ==========================================
  // LIGHT / DARK MODE
  // ==========================================

  const themeToggle = document.getElementById("theme-toggle");

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("oneup-theme");
  } catch (error) {
    // Continue if browser storage is unavailable.
  }

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  let currentTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : prefersDark ? "dark" : "light";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.textContent = isDark ? "☀" : "☾";
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  }

  applyTheme(currentTheme);

  themeToggle?.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);

    try {
      localStorage.setItem("oneup-theme", currentTheme);
    } catch (error) {
      // Theme still works without localStorage.
    }
  });

  // ==========================================
  // FOOTER YEAR
  // ==========================================

  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
