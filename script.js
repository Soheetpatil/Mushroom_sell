// ── Page Loader ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 1300);
});

// ── Mobile nav ──
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburger');
  if (!nav) return;
  const isOpen = nav.classList.toggle('open');
  if (btn) btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// ── Custom cursor ──
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .product-card, .featured-card, .feature-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor?.classList.add('hover'); cursorRing?.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor?.classList.remove('hover'); cursorRing?.classList.remove('hover'); });
});

// ── Particles ──
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  const emojis = ['🍄','🌿','🌱','✨','🍃','💚','🌾'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left              = Math.random() * 100 + 'vw';
    p.style.animationDuration = (12 + Math.random() * 20) + 's';
    p.style.animationDelay    = (Math.random() * 20) + 's';
    p.style.fontSize          = (0.6 + Math.random() * 1.2) + 'rem';
    particlesContainer.appendChild(p);
  }
}

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

// ── Cart ──
let cart = [];
let cartOpen = false;

function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById('cartSidebar')?.classList.toggle('open', cartOpen);
  document.getElementById('cartOverlay')?.classList.toggle('active', cartOpen);
}

function addToCart(btn, name, price) {
  cart.push({ name, price });
  updateCart();
  btn.textContent = '✓ Added';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 1600);
  showToast(`${name} added to cart! 🍄`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const count = cart.length;
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!itemsEl) return;
  if (count === 0) {
    itemsEl.innerHTML = '<p class="empty-cart">Your cart is empty 🍄</p>';
    if (totalEl) totalEl.style.display = 'none';
    return;
  }
  itemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-icon">🍄</div>
      <div class="cart-item-info"><h4>${item.name}</h4><p>$${item.price.toFixed(2)}</p></div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
    </div>`).join('');
  const total = cart.reduce((s, i) => s + i.price, 0);
  const tp = document.getElementById('totalPrice');
  if (tp) tp.textContent = '$' + total.toFixed(2);
  if (totalEl) totalEl.style.display = 'block';
}

// ── Checkout → WhatsApp ──
function checkoutWhatsApp() {
  if (!cart.length) return;
  const phone = '1234567890'; // 🔁 Replace with your number
  const lines = cart.map((item, i) => `  ${i+1}. ${item.name} — $${item.price.toFixed(2)}`).join('\n');
  const total = cart.reduce((s, i) => s + i.price, 0);
  const text  = `🍄 *New Order – Kapaleshwar Mushroom*\n\n🛒 *Order Summary:*\n${lines}\n\n💰 *Total: $${total.toFixed(2)}*\n\nPlease confirm my order. Thank you!`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  showToast('Opening WhatsApp... 💬');
}

// ── Toast ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Newsletter ──
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('Subscribed! 10% off code sent 🎉');
  e.target.reset();
}

// ── Contact → WhatsApp ──
function sendMessage(e) {
  e.preventDefault();
  const name    = document.getElementById('contactName')?.value.trim();
  const email   = document.getElementById('contactEmail')?.value.trim();
  const subject = document.getElementById('contactSubject')?.value || 'General';
  const message = document.getElementById('contactMessage')?.value.trim();
  const phone   = '+919798990420'; // 🔁 Replace with your number
  const text    = `🍄 *Kapaleshwar Mushroom – New Message*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n📌 *Subject:* ${subject}\n💬 *Message:* ${message}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  showToast('Opening WhatsApp... 💬');
  e.target.reset();
}

// ── Testimonials infinite loop ──
const track = document.getElementById('testimonialsInner');
if (track) {
  Array.from(track.children).forEach(c => track.appendChild(c.cloneNode(true)));
  let x = 0, paused = false, speed = 0.55;
  track.parentElement.addEventListener('mouseenter', () => paused = true);
  track.parentElement.addEventListener('mouseleave', () => paused = false);
  (function tick() {
    if (!paused) {
      x -= speed;
      if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(tick);
  })();
}

// ── Scroll reveal ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting)
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

// ── Counter animation ──
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = parseInt(el.dataset.target);
    let cur = 0; const step = target / 70;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { el.textContent = target; clearInterval(t); }
      else el.textContent = Math.floor(cur);
    }, 22);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(c => counterObs.observe(c));

// ── Magnetic buttons ──
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-4px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});
