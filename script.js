// Script sama persis seperti aslinya - tidak ada perubahan
let isPlaying=false;

document.addEventListener("DOMContentLoaded",()=>{
  const loader=document.getElementById("loader");
  loader.onclick=()=>{
    loader.classList.add("fade-out");
    setTimeout(()=>loader.style.display="none",500);
  };
  tampilKomentar();
  setTimeout(()=>window.dispatchEvent(new Event('scroll')),1000);
});

function openInvite(){
  document.getElementById('cover').style.display='none';
  document.getElementById('main').style.display='block';
  
  const music=document.getElementById('music');
  music.volume=0;
  music.play().then(()=>{
    isPlaying=true;
    updateMusicIcon();
    let vol=0;
    const fade=setInterval(()=>{
      vol+=0.04;
      music.volume=Math.min(vol,0.4);
      if(vol>=0.4)clearInterval(fade);
    },120);
  }).catch(e=>console.log("Music ready"));
}

function toggleMusic() {
  const music = document.getElementById('music');
  if (isPlaying) {
    music.pause();
    isPlaying = false;
  } else {
    music.play().catch(e => console.log("Music ready"));
    isPlaying = true;
  }
  updateMusicIcon();
}

function updateMusicIcon() {
  const btn = document.getElementById('musicBtn');
  const iconSpan = btn.querySelector('span');
  
  if (iconSpan) {
    iconSpan.innerHTML = isPlaying ? '⏸' : '▶';
    btn.title = isPlaying ? 'Pause Music' : 'Play Music';
  }
  console.log('🎵 Music:', isPlaying ? 'PLAYING' : 'PAUSED');
}

function kirimWA(){
  const n=document.getElementById("nama").value.trim();
  const s=document.getElementById("status").value;
  const p=document.getElementById("pesan").value.trim();
  if(!n){alert("Isi nama!");return;}
  const nomor="6282376697374";
  const text=`Halo Admin Wedding Taufik & Jihan!\n\n Nama: ${n}\n Status: ${s}\n\n Ucapan:\n${p||"Tidak ada ucapan"}`;
  window.open(`https://wa.me/${nomor}?text=${encodeURIComponent(text)}`,'_blank');
}

function kirimKomentar(){
  const n=document.getElementById("nama").value.trim();
  const p=document.getElementById("pesan").value.trim();
  if(!n||!p){alert("Isi nama & ucapan!");return;}
  let data=JSON.parse(localStorage.getItem("komentarWedding"))||[];
  data.unshift({nama:n,pesan:p,waktu:new Date().toLocaleString('id-ID'),id:Date.now()});
  if(data.length>50)data=data.slice(0,50);
  localStorage.setItem("komentarWedding",JSON.stringify(data));
  document.getElementById("nama").value="";
  document.getElementById("pesan").value="";
  tampilKomentar();
  alert("💖 Ucapan tersimpan!");
}
function tampilKomentar(){
  const list=document.getElementById("listKomentar");
  list.innerHTML="";
  let data=JSON.parse(localStorage.getItem("komentarWedding"))||[];
  if(data.length===0){list.innerHTML='<p style="color:#666;font-style:italic;">Belum ada ucapan... 💕</p>';return;}
  data.forEach(item=>{
    const div=document.createElement("div");
    div.className="comment-item";
    div.innerHTML=`<div class="avatar">${item.nama.charAt(0).toUpperCase()}</div><div class="comment-content"><div class="comment-name">${item.nama}</div><div class="comment-text">${item.pesan}</div><div class="comment-time">${item.waktu}</div></div>`;
    list.appendChild(div);
  });
}

function copyRek(){
  const norek="1234567890";
  navigator.clipboard.writeText(norek).then(()=>alert(`✅ Disalin!\n${norek}`)).catch(()=>{
    const ta=document.createElement("textarea");ta.value=norek;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);alert(`✅ Disalin!\n${norek}`);
  });
}

const faders=document.querySelectorAll(".fade");
window.addEventListener("scroll",()=>{faders.forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight-100)el.classList.add("show")})});

const params=new URLSearchParams(location.search);
const guest=params.get("to");
if(guest)document.getElementById("guest").innerText=`For ${guest.toUpperCase()}`;

// ================= SAVE TO CALENDAR =================
function saveToCalendar() {
  // 📅 UBAH TANGGAL PERNIKAHAN
  const event = {
    title: '🎸 Taufik & Jihan Wedding Festival',
    start: '2026-06-14T10:00:00+07:00',  // 14 Juni 2026 10:00 WIB
    end: '2026-06-14T14:00:00+07:00',    // Selesai 14:00
    location: 'Alila Hotel Solo, Jl. Slamet Riyadi 562',
    description: 'Undangan spesial Taufik & Jihan\nJangan lupa hadir ya! 💍✨',
    url: window.location.href
  };
  
  // Native Web Calendar API (iOS 14+/Android 8+)
  if (navigator.calendar) {
    navigator.calendar.createEvent(event).then(() => {
      alert('✅ Saved to Calendar!');
    }).catch(() => fallbackCalendar(event));
  } else {
    fallbackCalendar(event);
  }
}

function fallbackCalendar(event) {
  // ICS File Download (Semua device)
  const ics = generateICS(event);
  downloadICS(ics, 'taufik-jihan-wedding.ics');
}

function generateICS(event) {
  const start = new Date(event.start).toISOString().replace(/[:-]/g, '').slice(0, -5);
  const end = new Date(event.end).toISOString().replace(/[:-]/g, '').slice(0, -5);
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//Taufik Jihan//EN
BEGIN:VEVENT
UID:wedding-${Date.now()}@taufik-jihan.com
DTSTAMP:${new Date().toISOString().replace(/[:-]/g, '').slice(0, -5)}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
URL:${event.url}
END:VEVENT
END:VCALENDAR`;
}

function downloadICS(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Vibration feedback
  if (navigator.vibrate) navigator.vibrate(50);
  
  alert('📅 Downloaded! Buka file .ics di Calendar app');
}

// ================= COUNTDOWN TIMER - FIXED =================
function updateCountdown() {
  // Ganti testDate dengan:
  const weddingDate = new Date('2027-05-18T10:00:00+07:00').getTime();
  // 14 Juni 2026 jam 10 pagi WIB
  
  // PRODUCTION MODE (comment testDate, uncomment ini)
  // const weddingDate = new Date('2026-06-14T10:00:00+07:00').getTime();
  
  const now = new Date().getTime();
  const distance = weddingDate - now;
  
  console.log('Countdown distance:', distance); // Debug
  
  if (distance > 0) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Digital glitch effect
    const secEl = document.getElementById('seconds');
    secEl.style.transform = 'translateX(2px)';
    setTimeout(() => secEl.style.transform = '', 50);
    
  } else {
    // Wedding sudah lewat / test
    document.getElementById('countdown').innerHTML = 
      '<h1 style="color:#00ff9f;font-size:clamp(2rem,8vw,4rem);letter-spacing:0.3em;text-shadow:0 0 30px #00ff9f">🎉 WEDDING DAY! 🎸</h1>';
  }
}

// Jalankan setiap detik
setInterval(updateCountdown, 1000);
updateCountdown(); // Sekali awal

//-- Maps Lazy Loader --//

document.addEventListener('DOMContentLoaded', function() {
  const mapContainer = document.querySelector('.map-container');
  const mapIframe = mapContainer?.querySelector('iframe');
  
  if (mapContainer && mapIframe) {
    // Add loading class
    mapContainer.classList.add('loading');
    
    // iOS height fix
    function fixMapHeight() {
      mapContainer.style.height = '400px';
      if (window.innerHeight < 600) {
        mapContainer.style.height = (window.innerHeight * 0.5) + 'px';
      }
    }
    
    // Load map when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fixMapHeight();
          mapContainer.classList.remove('loading');
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(mapContainer);
    
    // Fallback resize
    window.addEventListener('resize', fixMapHeight);
  }
});