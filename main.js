// ============================
// PRODUCT DATA
// ============================
const variants = [
  { id: '100g',  label: '100 г',  sku: '01306', price: 326.40, oldPrice: 349.20 },
  { id: '500g',  label: '500 г',  sku: '01307', price: 1432.00, oldPrice: 1646.00 },
  { id: '1000g', label: '1000 г', sku: '01308', price: 2064.00, oldPrice: 2592.00 },
  { id: '5000g', label: '5000 г', sku: '01309', price: 6320.00, oldPrice: 8710.00 }
];

// ============================
// HELPERS
// ============================
function formatPrice(val) {
  // Format: "1 432 ₽" or "326,40 ₽"
  let str = val.toLocaleString('ru-RU', {
    minimumFractionDigits: (val % 1 === 0 ? 0 : 2),
    maximumFractionDigits: 2
  });
  return str + ' ₽';
}

function calcDiscount(current, old) {
  if (!old || old <= current) return 0;
  return Math.round((1 - current / old) * 100);
}

// ============================
// RENDER OPTIONS
// ============================
const optionsContainer = document.getElementById('options');
variants.forEach((v, i) => {
  const wrap = document.createElement('div');
  wrap.className = 'product__option';
  wrap.innerHTML = `
    <input type="radio" name="fasovka" id="${v.id}" value="${v.id}" ${i === 0 ? 'checked' : ''}>
    <label for="${v.id}">
      ${v.label}
      <span class="product__option-availability">В наличии</span>
    </label>
  `;
  optionsContainer.appendChild(wrap);
});

// ============================
// UPDATE INFO ON CHANGE
// ============================
const skuEl      = document.getElementById('sku');
const priceEl    = document.getElementById('price');
const priceOldEl = document.getElementById('priceOld');
const discountEl = document.getElementById('discount');

function updateProduct(variant) {
  skuEl.textContent = variant.sku;
  priceEl.textContent = formatPrice(variant.price);
  priceOldEl.textContent = formatPrice(variant.oldPrice);

  const pct = calcDiscount(variant.price, variant.oldPrice);
  if (pct > 0) {
    discountEl.textContent = '−' + pct + '%';
    discountEl.style.display = '';
    priceOldEl.style.display = '';
  } else {
    discountEl.style.display = 'none';
    priceOldEl.style.display = 'none';
  }
}

// initial state
updateProduct(variants[0]);

// listen for changes
optionsContainer.addEventListener('change', function(e) {
  if (e.target.name !== 'fasovka') return;
  const variant = variants.find(v => v.id === e.target.value);
  if (variant) updateProduct(variant);
});

// ============================
// QUANTITY CONTROLS
// ============================
const qtyInput  = document.getElementById('qty');
const qtyMinus  = document.getElementById('qtyMinus');
const qtyPlus   = document.getElementById('qtyPlus');

qtyMinus.addEventListener('click', () => {
  const val = parseInt(qtyInput.value) || 1;
  if (val > 1) qtyInput.value = val - 1;
});
qtyPlus.addEventListener('click', () => {
  const val = parseInt(qtyInput.value) || 1;
  if (val < 99) qtyInput.value = val + 1;
});
qtyInput.addEventListener('input', () => {
  let val = parseInt(qtyInput.value);
  if (isNaN(val) || val < 1) qtyInput.value = 1;
  if (val > 99) qtyInput.value = 99;
});

// ============================
// CART BUTTON (no real cart)
// ============================
const cartBtn = document.getElementById('cartBtn');
cartBtn.addEventListener('click', () => {
  const variant = variants.find(v => v.id === document.querySelector('input[name="fasovka"]:checked').value);
  const qty = parseInt(qtyInput.value) || 1;
  const originalHTML = cartBtn.innerHTML;
  cartBtn.innerHTML = '✓ Добавлено';
  cartBtn.style.background = '#5a9c6b';
  setTimeout(() => {
    cartBtn.innerHTML = originalHTML;
    cartBtn.style.background = '';
  }, 1800);
  console.log(`Добавлено в корзину: ${variant.label}, артикул ${variant.sku}, кол-во ${qty}, цена ${formatPrice(variant.price)}`);
});

// ============================
// IMAGE ZOOM MODAL
// ============================
const zoomTrigger = document.getElementById('zoomTrigger');
const modal       = document.getElementById('modal');
const modalImg    = document.getElementById('modalImg');
const modalClose  = document.getElementById('modalClose');
const productImg  = document.getElementById('productImage');

zoomTrigger.addEventListener('click', () => {
  modalImg.src = productImg.src;
  modal.classList.add('open');
});
modalClose.addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modal.classList.remove('open');
});