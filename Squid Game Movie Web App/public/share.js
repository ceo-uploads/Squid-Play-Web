window.onload = () => {
  const qrCanvas = document.getElementById("qrCanvas");
  const saveBtn = document.getElementById("saveBtn");
  const copyBtn = document.getElementById("copyBtn");

  // Check if QRCode exists
  if (typeof QRCode === "undefined") {
    console.error("QRCode library not loaded!");
    return;
  }

  // Get link (fallback = site root)
  const params = new URLSearchParams(window.location.search);
  const link = params.get("url") || window.location.origin + "/index.html";

  QRCode.toCanvas(qrCanvas, link, {
    width: 250,
    margin: 2,
    color: { dark: "#FF3B3F", light: "#0b0b15" },
  }, (err) => {
    if (err) return console.error(err);

    const ctx = qrCanvas.getContext("2d");
    const centerSize = 50;
    const centerX = qrCanvas.width / 2;
    const centerY = qrCanvas.height / 2;

    // Background circle
    ctx.fillStyle = "#0b0b15";
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw logo "U"
    ctx.fillStyle = "#FF3B3F";
    ctx.font = "bold 28px Oxanium";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("U", centerX, centerY - 4); // slightly adjust Y for spacing

    // Draw text "Unreal" under logo
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Inter";
    ctx.textAlign = "center";
    ctx.fillText("Unreal", centerX, centerY + 10); // below the logo
  });



  saveBtn.addEventListener("click", () => {
    const url = qrCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "squidplay-qr.png";
    a.click();
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error(err);
    }
  });
};




/* =========================
   Effects: reveal + cursor
   ========================= */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-active');
        obs.unobserve(e.target);
      }
    }
  }, { threshold: 0.15 });

  $$('.reveal-on-scroll').forEach(el => obs.observe(el));
}

function initCursor() {
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  if (!dot || !ring) return;

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let rx = x, ry = y;

  window.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.left = x + 'px'; dot.style.top = y + 'px';
  }, { passive: true });

  function loop() {
    rx += (x - rx) * 0.15;
    ry += (y - ry) * 0.15;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  // Grow ring on interactive targets
  ['a', 'button', '.overlay-link', '.card-ep'].forEach(sel => {
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(sel)) {
        ring.style.width = '54px';
        ring.style.height = '54px';
        ring.style.opacity = '1';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(sel)) {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.opacity = '.7';
      }
    });
  });

  // Click effect
  window.addEventListener('mousedown', () => {
    // Blow up the ring more
    ring.style.transform = 'translate(-50%, -50%) scale(2)'; // bigger scale
    ring.style.opacity = '0.4'; // fade slightly
  });

  window.addEventListener('mouseup', () => {
    // Return to original
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
    ring.style.opacity = '0.7';
  });
}


/* =========================
   Boot
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  renderSeasons();
  initEpisodePage();
  initReveal();
  initCursor();
});
