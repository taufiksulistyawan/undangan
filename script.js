// ================= OASIS 90s WEDDING - MAIN SCRIPT =================
let isPlaying = false;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎸 Oasis 90s Wedding Loaded!");
  
  // Loader
  const loader = document.getElementById("loader");
  loader.onclick = () => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.style.display = "none", 500);
  };

  // Load comments
  tampilKomentar();
  
  // Trigger fade
  setTimeout(() => window.dispatchEvent(new Event('scroll')), 1000);
});

// ================= ENTER THE SHOW =================
function openInvite() {
  document.getElementById('cover').style.display = 'none';
  document.getElementById('main').style.display = 'block';

  const music = document.getElementById('music');
  music.volume = 0;
  
  music.play().then(() => {
    console.log("🎵 Music Started!");
    isPlaying = true;
    updateMusicIcon();
    
    // Smooth volume fade-in
    let vol = 0;
    const fadeInterval = setInterval(() => {
      vol += 0.04;
      music.volume = Math.min(vol, 0.4);
      if (vol >= 0.4) clearInterval(fadeInterval);
    }, 120);
    
  }).catch(e => console.log("Music ready - click speaker"));
}

// ================= MUSIC CONTROLS =================
function toggleMusic() {
  const music = document.getElementById('music');
  if (isPlaying) {
    music.pause();
    isPlaying = false;
  } else {
    music.play().catch(e => alert("Click ENTER THE SHOW first!"));
    isPlaying = true;
  }
  updateMusicIcon();
}

function updateMusicIcon() {
  const status = document.querySelector('#musicBtn #musicStatus');
  if (status) {
    status.innerHTML = isPlaying ? "⏸" : "▶";
  }
}

// ================= WHATSAPP =================
function kirimWA() {
  const nama = document.getElementById("nama").value.trim();
  const status = document.getElementById("status").value;
  const pesan = document.getElementById("pesan").value.trim();

  if (!nama) {
    alert("😊 Isi nama dulu ya!");
    document.getElementById("nama").focus();
    return;
  }

  const nomorWA = "6281234567890"; // 👈 GANTI NOMOR ANDA
  const message = `Halo Admin Wedding Taufik & Jihan! 👰🤵

👤 Nama: ${nama}
✅ Status: ${status}

💌 Ucapan:
${pesan || "Tidak ada ucapan khusus"}`;

  const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ================= COMMENTS SYSTEM =================
function kirimKomentar() {
  const nama = document.getElementById("nama").value.trim();
  const pesan = document.getElementById("pesan").value.trim();

  if (!nama || !pesan) {
    alert("📝 Isi nama dan ucapan dulu!");
    return;
  }

  let data = JSON.parse(localStorage.getItem("komentarWedding")) || [];
  const newComment = {
    nama: nama,
    pesan: pesan,
    waktu: new Date().toLocaleString('id-ID'),
    id: Date.now()
  };

  data.unshift(newComment);
  if (data.length > 50) data = data.slice(0, 50);
  
  localStorage.setItem("komentarWedding", JSON.stringify(data));
  
  document.getElementById("nama").value = "";
  document.getElementById("pesan").value = "";
  
  tampilKomentar();
  alert("💖 Terima kasih atas ucapannya!");
}

function tampilKomentar() {
  const list = document.getElementById("listKomentar");
  if (!list) return;

  list.innerHTML = "";
  let data = JSON.parse(localStorage.getItem("komentarWedding")) || [];

  if (data.length === 0) {
    list.innerHTML = '<p style="color:#666;font-style:italic;font-size:1.1rem;">Belum ada ucapan... 💕</p>';
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "comment-item";
    div.innerHTML = `
      <div class="avatar">${item.nama.charAt(0).toUpperCase()}</div>
      <div class="comment-content">
        <div class="comment-name">${item.nama}</div>
        <div class="comment-text">${item.pesan}</div>
        <div class="comment-time">${item.waktu}</div>
      </div>
    `;
    list.appendChild(div);
  });
}

// ================= COPY REKENING =================
function copyRek() {
  const norek = "1234567890"; // 👈 GANTI NOMOR REKENING
  
  navigator.clipboard.writeText(norek).then(() => {
    alert(`✅ Rekening disalin!\n${norek}`);
  }).catch(() => {
    const textArea = document.createElement("textarea");
    textArea.value = norek;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert(`✅ Rekening disalin!\n${norek}`);
  });
}

// ================= SMOOTH SCROLL & FADE =================
const faders = document.querySelectorAll(".fade");
window.addEventListener("scroll", () => {
  faders.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});

// ================= PERSONALIZED GUEST =================
const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");
if (guestName) {
  const guestEl = document.getElementById("guest");
  if (guestEl) {
    guestEl.innerText = `For ${guestName.toUpperCase()}`;
    guestEl.style.animation = "pulse 2s infinite";
  }
}

// ================= DEBUG - CLEAR COMMENTS =================
// localStorage.removeItem("komentarWedding"); // Uncomment to reset