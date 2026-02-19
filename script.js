
        const stylesData = [
    {
        id: 1,
        title: "Gothic Blackletter",
        category: ["Complex", "Western"],
        desc: "A dense, angular style used in medieval manuscripts. Also known as Old English.",
        img: "https://picsum.photos/seed/gothic/400/300"
    },
    {
        id: 2,
        title: "Thuluth Script",
        category: ["Complex", "Arabic"],
        desc: "Elegant and grandiose, characterized by curved letters and intersecting lines.",
        img: "img/thss.jpg"
    },
    {
        id: 3,
        title: "Large Script",
        category: ["Complex", "Arabic"],
        desc: "Elegant and grandiose, characterized by curved letters and intersecting lines.",
        img: "img/th.avif"
    },
    {
        id: 4,
        title: "Thuluth Script",
        category: ["Complex", "Arabic"],
        desc: "Elegant and grandiose, characterized by curved letters and intersecting lines.",
        img: "https://picsum.photos/seed/arabic/400/300"
    },
    {
        id: 5,
        title: "Faux Calligraphy",
        category: ["Easy", "Kids"],
        desc: "The best way to start. Write in cursive, then thicken the downstrokes.",
        img: "https://picsum.photos/seed/faux/400/300"
    },
    {
        id: 6,
        title: "Modern Brush Lettering",
        category: ["Easy", "Modern"],
        desc: "Bouncy and playful, perfect for greeting cards and social media posts.",
        img: "https://picsum.photos/seed/brush/400/300"
    },
    {
        id: 7,
        title: "Modern Brush Lettering",
        category: ["Easy", "Western"],
        desc: "Bouncy and playful, perfect for greeting cards and social media posts.",
        img: "img/e88d73967cf3b08eb7d6786855a147b3.jpg"
    },
    {
        id: 8,
        title: "Copperplate",
        category: ["Complex", "Western"],
        desc: "Fine lines with elaborate loops and flourishes, written with a pointed nib.",
        img: "https://picsum.photos/seed/copper/400/300"
    },
    {
        id: 9,
        title: "Kaishu (Oriental)",
        category: ["Complex", "Oriental"],
        desc: "Regular script, the standard model for Chinese characters.",
        img: "https://picsum.photos/seed/chinese/400/300"
    }
];


        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
        }

        const galleryContainer = document.getElementById('gallery-container');

        function renderGallery(filter) {
            galleryContainer.innerHTML = '';
            
            let delayCounter = 0;

            const filtered = filter === 'all' 
                ? stylesData 
                : stylesData.filter(item => 
                    item.category.some(cat => cat.toLowerCase() === filter.toLowerCase())
                  );

            if(filtered.length === 0) {
                galleryContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No styles found in this category.</p>';
                return;
            }

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.animationDelay = `${delayCounter * 0.1}s`;
                
                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img src="${item.img}" alt="${item.title}" loading="lazy">
                    </div>
                    <div class="card-body">
                        <div class="card-tag">${item.category.join(' • ')}</div>
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-desc">${item.desc}</p>
                    </div>
                `;
                galleryContainer.appendChild(card);
                delayCounter++;
            });
        }

        function filterGallery(category) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            const targetBtn = Array.from(document.querySelectorAll('.filter-btn')).find(b => b.innerText.includes(category) || (category === 'all' && b.innerText === 'Show All'));
            if(targetBtn) targetBtn.classList.add('active');

            renderGallery(category);
        }

        const canvas = document.getElementById('practice-canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        
        let currentTool = { color: '#2c3e50', size: 4 };

        function resizeCanvas() {
            const wrapper = document.getElementById('canvas-wrapper');
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempCtx.drawImage(canvas, 0, 0);

            canvas.width = wrapper.offsetWidth;
            canvas.height = wrapper.offsetHeight;

            ctx.drawImage(tempCanvas, 0, 0);
            
            updateContext();
        }

        function updateContext() {
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentTool.color;
            ctx.lineWidth = currentTool.size;
        }

        function draw(e) {
            if (!isDrawing) return;
            
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            const rect = canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            [lastX, lastY] = [x, y];
        }

        canvas.addEventListener('mousedown', (e) => { isDrawing = true; [lastX, lastY] = [e.offsetX, e.offsetY]; });
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); 
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.touches[0].clientX - rect.left;
            lastY = e.touches[0].clientY - rect.top;
        }, { passive: false });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e);
        }, { passive: false });
        
        canvas.addEventListener('touchend', () => isDrawing = false);

        function setTool(type, size, color) {
            currentTool = { size, color };
            updateContext();
            
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            showToast("Canvas cleared!");
        }

        function saveArt() {
            const link = document.createElement('a');
            link.download = 'my-calligraphy.png';
            link.href = canvas.toDataURL();
            link.click();
            showToast("Image downloaded!");
        }

        function getLocation() {
            const output = document.getElementById('geo-result');
            const msg = document.getElementById('geo-msg');
            const coords = document.getElementById('geo-coords');
            
            output.style.display = 'block';
            msg.innerText = "Requesting location...";
            msg.style.color = "var(--text-main)";
            coords.innerText = "";

            if (!navigator.geolocation) {
                msg.innerText = "Geolocation is not supported by your browser.";
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    msg.innerText = "Location Found!";
                    msg.style.color = "#4caf50";
                    coords.innerText = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
                },
                () => {
                    msg.innerText = "Unable to retrieve your location.";
                    msg.style.color = "#f44336";
                }
            );
        }

        function submitFeedback(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            
            btn.disabled = true;
            btn.innerText = "Sending...";
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerText = originalText;
                showToast("Feedback sent successfully!");
                e.target.reset();
            }, 1500);
        }

        function showToast(message) {
            const container = document.getElementById('toast-area');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<span>✓</span> ${message}`;
            
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        window.addEventListener('DOMContentLoaded', () => {
            initTheme();
            renderGallery('all');
            resizeCanvas();
            
            window.addEventListener('resize', () => {
                clearTimeout(window.resizeTimer);
                window.resizeTimer = setTimeout(resizeCanvas, 100);
            });
        });
        /*Light Box*/
  const overlay = document.querySelector('.galleryOverlay');
  const lightboxImg = document.querySelector('.imgBox img');
  const imgBoxImg = document.querySelector('.imgBox img');
  const galleryImages = document.querySelectorAll('.galary-images');

//    image click
  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      overlay.style.display = 'flex';
      lightboxImg.src = img.src;
      imgBoxImg.src = img.src;
    });
  });

//    overlay ya click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === imgBoxImg.parentElement) {
      overlay.style.display = 'none';
    }
  });
  /*slider logic*/
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.previous');

let currentIndex = 0;
let images = [];
galleryImages.forEach((img, index) => {
  images.push(img.src);

  img.addEventListener('click', () => {
    currentIndex = index;
    showImage();
    overlay.style.display = 'flex';
  });
});
function showImage() {
  lightboxImg.src = images[currentIndex];
}
nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex++;

  if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  showImage();
});
prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }

  showImage();
});
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.style.display = 'none';
  }
});
/*Key Board Arrow*/
document.addEventListener('keydown', (e) => {
    if (overlay.style.display !== 'flex') return;
    if (e.key === 'ArrowRight') {

        currentIndex++;
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    showImage();
    }
    if(e.key === 'ArrowLeft') {
        currentIndex--;
    if (currentIndex < 0) {
        currentIndex = images.length -1;
    }
    showImage();
    }
    if (e.key === 'Escape') {
        overlay.style.display = 'none';
    }
});
