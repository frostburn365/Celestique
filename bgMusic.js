let isBGMLoaded = false;

window.addEventListener("DOMContentLoaded", () => {
  loadHTML("navbar.html", "#navbar");
  loadHTML("footer.html", "#footer");
  loadPage("home"); 
});

function loadHTML(file, selector) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    });
}

/**
 * Memuat konten halaman dari file .html dan menjalankannya
 * script yang relevan setelah konten dimuat.
 * @param {string} page - Nama halaman (tanpa .html)
 */
function loadPage(page) {
  fetch(`${page}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;

      if (page === "gallery") {
        loadScript("gallery.js", initGalleryCarousel);
      } else if (page === "reservation") {
        loadScript("booking.js", initBookingForm);
      }

      if (!isBGMLoaded) {
        setTimeout(playBGM, 100);
      }
    });
}

/**
 * Membuat elemen script baru dan menambahkannya ke halaman.
 * Menjalankan fungsi callback setelah script selesai dimuat.
 * @param {string} src - Path ke file JavaScript
 * @param {function} callback - Fungsi yang akan dijalankan setelah script dimuat
 */
function loadScript(src, callback) {
  // Hapus script lama jika ada, untuk memastikan versi terbaru yang berjalan
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    existing.remove();
  }

  const script = document.createElement("script");
  script.src = src;

  script.onload = function() {
    if (callback) {
      callback();
    }
  };

  document.body.appendChild(script);
}


function playBGM() {
  const bgm = document.getElementById("bg-music");
  if (!bgm) return;

  bgm.volume = 0.0;
  const tryPlay = bgm.play();

  if (tryPlay !== undefined) {
    tryPlay
      .then(() => {
        isBGMLoaded = true;
        fadeInAudio(bgm, 0.5, 2000); 
      })
      .catch(err => {
        console.warn("Audio autoplay diblokir oleh browser:", err);
      });
  }
}

/**
 * Efek fade-in untuk elemen audio.
 * @param {HTMLAudioElement} audio 
 * @param {number} targetVolume 
 * @param {number} duration 
 */
function fadeInAudio(audio, targetVolume, duration) {
  let step = 0.01;
  let interval = duration / (targetVolume / step);

  let fade = setInterval(() => {
    if (audio.volume < targetVolume) {
      audio.volume = Math.min(audio.volume + step, targetVolume);
    } else {
      clearInterval(fade);
    }
  }, interval);
}


function enterSite() {
  const overlay = document.getElementById("welcome-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
  playBGM(); 
}