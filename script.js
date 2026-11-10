const doc = document.documentElement;
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const cursorGrid = document.querySelector(".cursor-glow");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateScrollState() {
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.width = `${Math.min(ratio * 100, 100)}%`;
  header.classList.toggle("scrolled", window.scrollY > 14);
}

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px" }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  revealObserver.observe(element);
});

const sectionMap = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a[href^='#']")];

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.35 }
);

sectionMap.forEach((section) => activeObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll("[data-counter]").forEach((counter) => {
  counterObserver.observe(counter);
});

function animateCounter(element) {
  const target = Number(element.dataset.counter);
  const duration = reduceMotion ? 1 : 1200;
  const start = performance.now();

  function frame(now) {
    const progressValue = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progressValue, 3);
    element.textContent = `${Math.round(target * eased)}+`;
    if (progressValue < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

document.querySelectorAll(".spotlight-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--spot-x", `${x}%`);
    card.style.setProperty("--spot-y", `${y}%`);
  });
});

if (!reduceMotion) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.14}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".event-card").forEach((card) => {
      const isVisible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !isVisible);
    });
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0px";
  });
});

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    //event.preventDefault();
    const note = form.querySelector("[data-form-note]");
    note.textContent =
      form.dataset.form === "connexion"
        ? "Connexion en cours…"
        : "Message prêt à être transmis. Merci pour votre prise de contact.";
    // form.reset();
  });
});

if (cursorGrid && !reduceMotion) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorGrid.style.opacity = "1";
      cursorGrid.style.left = `${event.clientX}px`;
      cursorGrid.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    cursorGrid.style.opacity = "0";
  });
}

function initNetworkCanvas() {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  let nodes = [];
  let pointer = { x: null, y: null };
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(Math.min(118, Math.max(54, width / 15)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      size: Math.random() * 1.6 + 0.7,
    }));
  }

  function drawLine(a, b, distance, maxDistance) {
    const opacity = 1 - distance / maxDistance;
    context.strokeStyle = `rgba(2, 168, 216, ${opacity * 0.26})`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();
  }

  function animate() {
    context.clearRect(0, 0, width, height);
    const maxDistance = width < 760 ? 96 : 132;

    nodes.forEach((node, index) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 0 || node.x >= width) node.vx *= -1;
      if (node.y <= 0 || node.y >= height) node.vy *= -1;

      if (pointer.x !== null) {
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 120 && distance > 0) {
          node.x += (dx / distance) * 0.18;
          node.y += (dy / distance) * 0.18;
        }
      }

      for (let next = index + 1; next < nodes.length; next += 1) {
        const other = nodes[next];
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance < maxDistance) drawLine(node, other, distance, maxDistance);
      }

      context.fillStyle = index % 5 === 0 ? "rgba(255, 122, 0, 0.86)" : "rgba(255, 255, 255, 0.72)";
      context.beginPath();
      context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      context.fill();
    });

    animationFrame = requestAnimationFrame(animate);
  }

  resize();
  if (!reduceMotion) animate();

  window.addEventListener("resize", resize, { passive: true });
  canvas.addEventListener(
    "pointermove",
    (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    },
    { passive: true }
  );
  canvas.addEventListener("pointerleave", () => {
    pointer = { x: null, y: null };
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else if (!reduceMotion) {
      animationFrame = requestAnimationFrame(animate);
    }
  });
}

initNetworkCanvas();
