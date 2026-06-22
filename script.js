// Cozy Loop E-Commerce Core Logic
// Stitched with precision for Joseph Paul (@cozyloop_2212)

const WHATSAPP_NUMBER = '60123456789'; // Default WhatsApp number
const SHIPPING_WEST = 8.00;

// Setup year automatically
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Navigation toggle (mobile hamburger)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Full Product Database
let products = [
  // Cozy Treats (Desserts)
  {
    id: 'matcha-strawberry',
    category: 'treats',
    name: 'Matcha Strawberry Swiss Roll',
    img: 'matcha-strawberry',
    price: 10.50,
    desc: 'A delightful slice of matcha roll cake with a sweet strawberry swirl, made with high-quality soft cotton yarn.',
    size: 'Approx. 5cm x 4cm',
    materials: '100% Milk Cotton Yarn, Polyester Fiberfill'
  },
  {
    id: 'orange-swiss',
    category: 'treats',
    name: 'Orange Swiss Roll',
    img: 'orange-swiss',
    price: 10.50,
    desc: 'A bright, citrusy orange-flavored slice of crochet swiss roll cake. Sweet and calorie-free!',
    size: 'Approx. 5cm x 4cm',
    materials: '100% Milk Cotton Yarn, Polyester Fiberfill'
  },
  {
    id: 'blueberry-swiss',
    category: 'treats',
    name: 'Blueberry Swiss Roll',
    img: 'blueberry-swiss',
    price: 10.50,
    desc: 'A delicious blueberry roll cake replica with details stitched to perfection.',
    size: 'Approx. 5cm x 4cm',
    materials: '100% Milk Cotton Yarn, Polyester Fiberfill'
  },
  {
    id: 'mini-choc-cake',
    category: 'treats',
    name: 'Mini Chocolate Cake',
    img: 'mini-choc-cake',
    price: 5.50,
    desc: 'A tiny slice of chocolate cake topped with a dollop of cream and a cherry on top.',
    size: 'Approx. 4cm x 4cm',
    materials: '100% Milk Cotton Yarn, Polyester Fiberfill'
  },
  {
    id: 'mini-taro-cake',
    category: 'treats',
    name: 'Mini Taro Cake',
    img: 'mini-taro-cake',
    price: 6.50,
    desc: 'A soft taro purple mini cake, layered with cream and textured stitches.',
    size: 'Approx. 4.5cm x 4.5cm',
    materials: '100% Milk Cotton Yarn, Polyester Fiberfill'
  },
  {
    id: 'mini-birthday-cake',
    category: 'treats',
    name: 'Mini Birthday Cake',
    img: 'mini-birthday-cake',
    price: 6.50,
    desc: 'A festive little cake with a stitched candle. Perfect birthday gift for a craft lover.',
    size: 'Approx. 4.5cm x 6cm (with candle)',
    materials: '100% Milk Cotton Yarn, Polyester Fiberfill'
  },
  {
    id: 'mini-caramel-pudding',
    category: 'treats',
    name: 'Mini Caramel Pudding',
    img: 'caramel-pudding',
    price: 6.50,
    desc: 'A cute little caramel flan pudding with cream on top. Looks incredibly soft and sweet.',
    size: 'Approx. 4.5cm x 4cm',
    materials: '100% Milk Cotton Yarn, Polyester Fiberfill'
  },

  // Cozy Paws (Animal Keychains)
  {
    id: 'mini-bear',
    category: 'paws',
    name: 'Mini Bear Keychain',
    img: 'mini-bear',
    price: 10.50,
    sub: 'per piece',
    desc: 'A cute chubby bear keychain with a red ribbon. Loop it on your backpack or keys!',
    size: 'Approx. 6cm x 5cm',
    materials: '100% Milk Cotton Yarn, safety eyes, metal keychain ring'
  },
  {
    id: 'mushy-mushroom',
    category: 'paws',
    name: 'Mushy Mushroom',
    img: 'mushy-mushroom',
    price: 10.50,
    sub: 'custom hat colour & design',
    desc: 'A lovely mushroom with a cute cap. Customize the hat colour and design to your liking.',
    size: 'Approx. 5.5cm x 4.5cm',
    materials: '100% Milk Cotton Yarn, Polyester Fiberfill, metal keychain ring'
  },
  {
    id: 'duck',
    category: 'paws',
    name: 'Duck Keychain',
    img: 'duck',
    price: 5.50,
    desc: 'An adorable round duckling keychain, stitched in bright yellow cotton.',
    size: 'Approx. 4.5cm x 4.5cm',
    materials: '100% Milk Cotton Yarn, safety eyes, metal keychain ring'
  },
  {
    id: 'grey-cat',
    category: 'paws',
    name: 'Grey Cat Keychain',
    img: 'grey-cat',
    price: 6.50,
    desc: 'A round squishy grey kitty keychain. Soft, round, and full of purrfect details.',
    size: 'Approx. 5cm x 5cm',
    materials: '100% Milk Cotton Yarn, safety eyes, metal keychain ring'
  },
  {
    id: 'black-cat',
    category: 'paws',
    name: 'Black Cat Keychain',
    img: 'black-cat',
    price: 6.50,
    desc: 'A black kitten keychain with a striking gold patch around one eye. A mysterious little helper for your keys.',
    size: 'Approx. 5cm x 5cm',
    materials: '100% Milk Cotton Yarn, safety eyes, metal keychain ring'
  },
  {
    id: 'white-cat',
    category: 'paws',
    name: 'White Cat Keychain',
    img: 'white-cat',
    price: 6.50,
    desc: 'A pure white kitten keychain with sweet sleepy features. Round and squishy.',
    size: 'Approx. 5cm x 5cm',
    materials: '100% Milk Cotton Yarn, safety eyes, metal keychain ring'
  },
  {
    id: 'baby-chick',
    category: 'paws',
    name: 'Baby Chick',
    img: 'baby-chick',
    price: 5.50,
    desc: 'A tiny baby chick popping out, complete with cute little orange cheeks and safety eyes.',
    size: 'Approx. 4cm x 4cm',
    materials: '100% Milk Cotton Yarn, safety eyes, phone strap/keychain'
  },
  {
    id: 'twin-tulip',
    category: 'paws',
    name: 'Twin Tulip Keychain',
    img: 'twin-tulip',
    price: 5.50,
    desc: 'Two pastel tulips hanging together. A beautiful, delicate bag charm that adds a floral touch.',
    size: 'Tulip heads approx. 3cm each',
    materials: '100% Milk Cotton Yarn, metal keychain ring'
  },

  // Accessories
  {
    id: 'flower-bouquet',
    category: 'accessories',
    name: 'Flower Bouquet',
    img: 'flower-bouquet',
    price: 5.50,
    desc: 'A mini everlasting crochet bouquet. Sunflowers, daisies, and lavender that never wilt.',
    size: 'Approx. 18cm long',
    materials: '100% Milk Cotton Yarn, flower stems, wrapping paper, ribbon'
  },
  {
    id: 'scrunchie',
    category: 'accessories',
    name: 'Scrunchie',
    img: 'scrunchie',
    price: 4.00,
    sub: 'per piece',
    desc: 'Soft and stretchy crochet hair scrunchie. Gentle on hair and looks lovely on the wrist too.',
    size: 'Standard elastic, approx. 10cm diameter',
    materials: '100% Milk Cotton Yarn, elastic band'
  },
  {
    id: 'hair-clip',
    category: 'accessories',
    name: 'Hair Clip',
    img: 'hair-clip',
    price: 3.50,
    desc: 'A cute crochet cherry, flower, or strawberry decoration stitched securely onto a metal clip.',
    size: 'Approx. 6cm length',
    materials: '100% Milk Cotton Yarn, metal snap clip'
  },
  {
    id: 'claw-clip',
    category: 'accessories',
    name: 'Claw Clip',
    img: 'claw-clip',
    price: 3.50,
    desc: 'A mini hair claw clip wrapped or decorated with adorable crochet elements.',
    size: 'Approx. 5cm length',
    materials: '100% Milk Cotton Yarn, plastic claw clip'
  }
];

// E-Commerce State
let cart = [];
let currentCategory = 'all';
let searchQuery = '';
let selectedProduct = null;
let activeStep = 1;
let currentShippingCost = SHIPPING_WEST;
let currentCheckoutMode = 'mock';
let activeOrder = null;

// Initial Setup
document.addEventListener('DOMContentLoaded', async () => {
  loadCart();
  
  // Attempt to load dynamic products from /products.json (server-managed). If unavailable, fall back to embedded list.
  try {
    const resp = await fetch('/products.json', { cache: 'no-store' });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length) {
        products = data;
      }
    }
  } catch (err) {
    // Fail silently and use embedded products
    console.warn('products.json fetch failed:', err);
  }

  // Only render products if shop list is present
  if (document.getElementById('shopGrid')) {
    renderProducts();
  }
  
  setupEventListeners();
  updateCartUI();
});

// Render Catalog Products (only on shop.html)
function renderProducts() {
  const shopGrid = document.getElementById('shopGrid');
  if (!shopGrid) return;

  const filtered = products.filter(p => {
    const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    shopGrid.className = '';
    shopGrid.innerHTML = `
      <div class="shop-empty-state">
        <span class="empty-icon"><svg class="icon-svg" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 16px; display: block; opacity: 0.6;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
        <p>No matching crochet creations found. Try another search!</p>
      </div>`;
    return;
  }

  shopGrid.className = 'products-list';

  shopGrid.innerHTML = filtered.map((p, idx) => {
    const indexStr = String(idx + 1).padStart(2, '0');
    
    // Create tag list elements
    const tags = [];
    if (p.category === 'treats') tags.push('DESSERT');
    if (p.category === 'paws') tags.push('KEYCHAIN');
    if (p.category === 'accessories') tags.push('ACCESSORY');
    tags.push(`RM ${p.price.toFixed(2)}`);
    if (p.sub) tags.push(p.sub);

    const tagsHTML = tags.map(t => `<span class="brutalist-tag">${t}</span>`).join('');

    return `
      <div class="product-item" onclick="openProductModal('${p.id}')">
        <div class="product-item__index">${indexStr}</div>
        <div class="product-item__media">
          <img src="${p.img && p.img.includes('/') ? 'images/' + p.img : 'images/' + p.img + '.jpg'}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="product-item__info">
          <h3 class="product-item__title">${p.name}</h3>
          <div class="product-item__tags">
            ${tagsHTML}
          </div>
        </div>
        <div class="product-item__arrow">→</div>
      </div>`;
  }).join('');
}

// Setup Page-specific Event Listeners
function setupEventListeners() {
  // Category filter tabs (shop.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderProducts();
    });
  });

  // Search input (shop.html)
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Product modal adjustments (shop.html)
  const productModalCloseBtn = document.getElementById('productModalCloseBtn');
  const productModalOverlay = document.getElementById('productModalOverlay');
  if (productModalCloseBtn) productModalCloseBtn.addEventListener('click', closeProductModal);
  if (productModalOverlay) productModalOverlay.addEventListener('click', closeProductModal);

  const modalQtyMinus = document.getElementById('modalQtyMinus');
  const modalQtyPlus = document.getElementById('modalQtyPlus');
  const modalQtyVal = document.getElementById('modalQtyVal');

  if (modalQtyMinus && modalQtyVal) {
    modalQtyMinus.addEventListener('click', () => {
      let qty = parseInt(modalQtyVal.textContent);
      if (qty > 1) {
        modalQtyVal.textContent = qty - 1;
      }
    });
  }
  if (modalQtyPlus && modalQtyVal) {
    modalQtyPlus.addEventListener('click', () => {
      let qty = parseInt(modalQtyVal.textContent);
      modalQtyVal.textContent = qty + 1;
    });
  }

  // Add standard product to basket
  const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', handleAddToCart);
  }

  // Custom commission form submit (custom.html)
  const customOrderSubmitBtn = document.getElementById('customOrderSubmitBtn');
  if (customOrderSubmitBtn) {
    customOrderSubmitBtn.addEventListener('click', handleCustomOrderSubmit);
  }

  // WhatsApp direct checkout button (cart.html step 1)
  const checkoutWhatsappBtn = document.getElementById('checkoutWhatsappBtn');
  if (checkoutWhatsappBtn) {
    checkoutWhatsappBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const form = document.getElementById('deliveryForm');
      if (form) {
        if (form.reportValidity()) {
          const loader = document.getElementById('checkoutLoader');
          if (loader) loader.classList.remove('hidden');
          
          try {
            const savedOrder = await submitOrderToServer();
            if (loader) loader.classList.add('hidden');
            generateReceiptData(savedOrder);
            executeWhatsappRedirect(savedOrder);
            goToCheckoutStep(2);
            clearCart();
          } catch (err) {
            if (loader) loader.classList.add('hidden');
            alert('Failed to process checkout: ' + err.message);
          }
        }
      }
    });
  }

  // Instagram direct checkout button (cart.html step 1)
  const checkoutInstagramBtn = document.getElementById('checkoutInstagramBtn');
  if (checkoutInstagramBtn) {
    checkoutInstagramBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const form = document.getElementById('deliveryForm');
      if (form) {
        if (form.reportValidity()) {
          const loader = document.getElementById('checkoutLoader');
          if (loader) loader.classList.remove('hidden');
          
          try {
            const savedOrder = await submitOrderToServer();
            if (loader) loader.classList.add('hidden');
            generateReceiptData(savedOrder);
            executeInstagramRedirect(savedOrder);
            goToCheckoutStep(2);
            clearCart();
          } catch (err) {
            if (loader) loader.classList.add('hidden');
            alert('Failed to process checkout: ' + err.message);
          }
        }
      }
    });
  }

  // Shipping cost recalculation triggers (cart.html)
  const shipRegion = document.getElementById('shipRegion');
  if (shipRegion) {
    shipRegion.addEventListener('change', (e) => {
      updateCartUI();
    });
  }

  // Checkout back to Step 1 details (cart.html)
  const checkoutBackTo1 = document.getElementById('checkoutBackTo1');
  if (checkoutBackTo1) {
    checkoutBackTo1.addEventListener('click', () => {
      goToCheckoutStep(1);
    });
  }

  // Copy receipt summary code (cart.html)
  const btnCopyReceipt = document.getElementById('btnCopyReceipt');
  if (btnCopyReceipt) {
    btnCopyReceipt.addEventListener('click', copyReceiptText);
  }

  // Continue shopping button after transaction success (cart.html)
  const btnSuccessDone = document.getElementById('btnSuccessDone');
  if (btnSuccessDone) {
    btnSuccessDone.addEventListener('click', () => {
      clearCart();
      window.location.href = 'shop.html';
    });
  }
}

// Product detail modal management
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  selectedProduct = product;

  const modalImg = document.getElementById('modalProductImg');
  const modalName = document.getElementById('modalProductName');
  const modalPrice = document.getElementById('modalProductPrice');
  const modalDesc = document.getElementById('modalProductDesc');
  const modalSize = document.getElementById('modalProductSize');
  const modalMaterials = document.getElementById('modalProductMaterials');
  const modalQtyVal = document.getElementById('modalQtyVal');
  const modalAttachSelect = document.getElementById('modalOptionAttach');
  const modalNotesInput = document.getElementById('modalOptionNotes');

  if (modalImg) modalImg.src = product.img && product.img.includes('/') ? `images/${product.img}` : `images/${product.img}.jpg`;
  if (modalImg) modalImg.alt = product.name;
  if (modalName) modalName.textContent = product.name;
  if (modalPrice) modalPrice.textContent = `RM ${product.price.toFixed(2)}`;
  if (modalDesc) modalDesc.textContent = product.desc;
  if (modalSize) modalSize.textContent = product.size;
  if (modalMaterials) modalMaterials.textContent = product.materials;
  if (modalQtyVal) modalQtyVal.textContent = '1';
  if (modalAttachSelect) modalAttachSelect.value = 'None';
  if (modalNotesInput) modalNotesInput.value = '';

  const attachmentDropdown = document.getElementById('modalOptionAttach');
  if (attachmentDropdown && attachmentDropdown.parentElement) {
    if (product.category === 'paws' || product.id === 'scrunchie' || product.id === 'hair-clip' || product.id === 'claw-clip') {
      attachmentDropdown.parentElement.style.display = 'flex';
    } else {
      attachmentDropdown.parentElement.style.display = 'none';
    }
  }

  const modal = document.getElementById('productModal');
  if (modal) {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
  }
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
  }
  selectedProduct = null;
}

// Add Standard Catalog Product to Basket
function handleAddToCart() {
  if (!selectedProduct) return;

  const modalQtyVal = document.getElementById('modalQtyVal');
  const attachSelect = document.getElementById('modalOptionAttach');
  const notesInput = document.getElementById('modalOptionNotes');

  const qty = modalQtyVal ? parseInt(modalQtyVal.textContent) : 1;
  const attachType = attachSelect ? attachSelect.value : 'None';
  const notes = notesInput ? notesInput.value.trim() : '';

  let attachPrice = 0;
  if (attachType === 'Lobster Clasp Keychain') attachPrice = 1.00;
  if (attachType === 'Pastel Phone Strap') attachPrice = 0.50;

  const cartItemId = `${selectedProduct.id}-${attachType.replace(/\s+/g, '')}-${notes.replace(/\s+/g, '')}`;

  const existing = cart.find(item => item.cartItemId === cartItemId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      cartItemId: cartItemId,
      id: selectedProduct.id,
      name: selectedProduct.name,
      img: selectedProduct.img,
      basePrice: selectedProduct.price,
      price: selectedProduct.price + attachPrice,
      attachPrice: attachPrice,
      quantity: qty,
      options: {
        attach: attachType,
        notes: notes
      }
    });
  }

  saveCart();
  updateCartUI();
  
  const addBtn = document.getElementById('modalAddToCartBtn');
  if (addBtn) {
    const originalText = addBtn.innerHTML;
    addBtn.innerHTML = 'ADDED! <svg class="icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-left: 4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    addBtn.classList.add('success');
    addBtn.disabled = true;

    setTimeout(() => {
      addBtn.innerHTML = originalText;
      addBtn.classList.remove('success');
      addBtn.disabled = false;
      closeProductModal();
      window.location.href = 'cart.html'; // Direct redirect to cart page after add
    }, 800);
  }
}

// Add custom bespoke orders (custom.html)
function handleCustomOrderSubmit() {
  const nameInput = document.getElementById('customName');
  const descInput = document.getElementById('customDesc');
  const colorsInput = document.getElementById('customColors');
  const attachSelect = document.getElementById('customAttach');
  const budgetInput = document.getElementById('customBudget');

  if (!nameInput || !descInput) return;

  if (!nameInput.value.trim() || !descInput.value.trim()) {
    alert('Please fill in the item name and details description.');
    return;
  }

  const name = nameInput.value.trim();
  const desc = descInput.value.trim();
  const colors = colorsInput ? colorsInput.value.trim() : '';
  const attachType = attachSelect ? attachSelect.value : 'None';
  const budget = budgetInput ? (parseFloat(budgetInput.value) || 15.00) : 15.00;

  let attachPrice = 0;
  if (attachType === 'Lobster Clasp Keychain') attachPrice = 1.00;
  if (attachType === 'Pastel Phone Strap') attachPrice = 0.50;

  const cartItemId = `custom-${Date.now()}`;

  cart.push({
    cartItemId: cartItemId,
    id: 'custom-creation',
    name: `Commission: ${name}`,
    img: 'logo',
    basePrice: budget,
    price: budget + attachPrice,
    attachPrice: attachPrice,
    quantity: 1,
    customDetails: desc,
    options: {
      attach: attachType,
      notes: `Colors: ${colors || 'Any color'}`
    }
  });

  saveCart();
  updateCartUI();

  // Reset inputs
  nameInput.value = '';
  descInput.value = '';
  if (colorsInput) colorsInput.value = '';
  if (attachSelect) attachSelect.value = 'None';
  if (budgetInput) budgetInput.value = '15';

  const customSuccessModal = document.getElementById('customSuccessModal');
  if (customSuccessModal) {
    customSuccessModal.style.display = 'flex';
  } else {
    window.location.href = 'cart.html';
  }
}

// Update Cart DOM structures safely
function updateCartUI() {
  const cartCountNav = document.getElementById('cartCountNav');
  const cartCountFloating = document.getElementById('floatingCartCount');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const container = document.getElementById('cartItemsContainer');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartSummaryBlock = document.getElementById('cartSummaryBlock');

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartCountNav) cartCountNav.textContent = totalQty;
  if (cartCountFloating) {
    cartCountFloating.textContent = totalQty;
    cartCountFloating.classList.add('bump');
    setTimeout(() => cartCountFloating.classList.remove('bump'), 300);
  }
  if (cartBadgeCount) cartBadgeCount.textContent = totalQty;

  // Render cart items if list panel is loaded
  if (container) {
    if (cart.length === 0) {
      container.style.display = 'none';
      if (cartEmptyState && activeStep !== 2) cartEmptyState.style.display = 'block';
      if (cartSummaryBlock) cartSummaryBlock.style.display = 'none';
      
      const checkoutFlowContainer = document.getElementById('checkoutFlowContainer');
      if (checkoutFlowContainer && activeStep !== 2) checkoutFlowContainer.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    if (cartEmptyState) cartEmptyState.style.display = 'none';
    if (cartSummaryBlock) cartSummaryBlock.style.display = 'flex';
    
    const checkoutFlowContainer = document.getElementById('checkoutFlowContainer');
    if (checkoutFlowContainer) checkoutFlowContainer.style.display = 'block';

    container.innerHTML = cart.map(item => {
      let optionsText = '';
      if (item.options.attach && item.options.attach !== 'None') {
        optionsText += `<span class="cart-item__option"><svg class="icon-svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> ${item.options.attach}</span>`;
      }
      if (item.options.notes) {
        optionsText += `<span class="cart-item__option"><svg class="icon-svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-4 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-4 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg> ${item.options.notes}</span>`;
      }
      if (item.customDetails) {
        optionsText += `<span class="cart-item__option cart-item__option--details"><svg class="icon-svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> ${item.customDetails}</span>`;
      }

      return `
        <div class="cart-item">
          <div class="cart-item__media">
            <img src="${item.img && item.img.includes('/') ? 'images/' + item.img : 'images/' + item.img + '.jpg'}" alt="${item.name}" />
          </div>
          <div class="cart-item__details">
            <h4 class="cart-item__name">${item.name}</h4>
            ${optionsText}
            <div class="cart-item__bottom">
              <div class="cart-item__qty">
                <button onclick="changeCartItemQty('${item.cartItemId}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeCartItemQty('${item.cartItemId}', 1)">+</button>
              </div>
              <span class="cart-item__price">RM ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
          <button class="cart-item__remove" onclick="removeCartItem('${item.cartItemId}')" aria-label="Remove item">&times;</button>
        </div>`;
    }).join('');

    const subtotal = getCartSubtotal();
    
    const shipRegion = document.getElementById('shipRegion');
    if (shipRegion) {
      const region = shipRegion.value;
      if (region === 'Melaka') currentShippingCost = 6.00;
      else if (region === 'Kuala Lumpur') currentShippingCost = 8.00;
      else if (region === 'Johor Bahru') currentShippingCost = 8.00;
      else currentShippingCost = 10.00; // Others
    }
    
    const total = subtotal + currentShippingCost;

    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('shippingChargeText');
    const totalEl = document.getElementById('cartTotal');

    if (subtotalEl) subtotalEl.textContent = `RM ${subtotal.toFixed(2)}`;
    
    if (shippingEl) {
      const regionName = shipRegion ? shipRegion.options[shipRegion.selectedIndex].text.split(' (')[0] : 'Peninsular M\'sia';
      shippingEl.textContent = `${regionName.toUpperCase()} (RM ${currentShippingCost.toFixed(2)})`;
    }
    
    if (totalEl) totalEl.textContent = `RM ${total.toFixed(2)}`;
  }
}

window.changeCartItemQty = function(cartItemId, delta) {
  const item = cart.find(item => item.cartItemId === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.cartItemId !== cartItemId);
  }
  saveCart();
  updateCartUI();
};

window.removeCartItem = function(cartItemId) {
  cart = cart.filter(i => i.cartItemId !== cartItemId);
  saveCart();
  updateCartUI();
};

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('cozyloop_cart', JSON.stringify(cart));
}

function loadCart() {
  const data = localStorage.getItem('cozyloop_cart');
  if (data) {
    try {
      cart = JSON.parse(data);
    } catch(e) {
      cart = [];
    }
  }
}

// Dedicated multi-step checkout step toggles (cart.html)
function goToCheckoutStep(stepNum) {
  activeStep = stepNum;

  const indicators = document.querySelectorAll('.checkout-steps .step');
  indicators.forEach((ind, idx) => {
    if (idx + 1 === stepNum) {
      ind.classList.add('active');
      ind.style.opacity = '1';
    } else {
      ind.classList.remove('active');
      ind.style.opacity = '0.5';
    }
  });

  const stepPanels = document.querySelectorAll('.checkout-step-content');
  stepPanels.forEach(panel => panel.classList.add('hidden'));

  const currentPanel = document.getElementById(`checkoutStep${stepNum}`);
  if (currentPanel) {
    currentPanel.classList.remove('hidden');
  }

  // If proceeding to Step 2, update totals
  if (stepNum === 2) {
    const subtotal = getCartSubtotal();
    const total = subtotal + currentShippingCost;
    
    const qrAmount = document.getElementById('qrAmount');
    const payAmountBtn = document.getElementById('payAmountBtn');
    if (qrAmount) qrAmount.textContent = `RM ${total.toFixed(2)}`;
    if (payAmountBtn) payAmountBtn.textContent = `RM ${total.toFixed(2)}`;
  }
}

// Submit Order to Server API
async function submitOrderToServer() {
  const name = document.getElementById('shipName').value.trim();
  const phone = document.getElementById('shipPhone').value.trim();
  const address = document.getElementById('shipAddress').value.trim();
  const postcode = document.getElementById('shipPostcode').value.trim();
  const city = document.getElementById('shipCity').value.trim();
  const shipRegionEl = document.getElementById('shipRegion');
  const state = shipRegionEl ? shipRegionEl.value : 'Melaka';

  const subtotal = getCartSubtotal();
  const total = subtotal + currentShippingCost;

  const orderPayload = {
    customer: { name, phone, address, postcode, city, state },
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      options: {
        attach: item.options?.attach || 'None',
        notes: item.options?.notes || ''
      },
      customDetails: item.customDetails || ''
    })),
    subtotal: subtotal,
    shippingCost: currentShippingCost,
    total: total,
    region: state,
    notes: ''
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });
    
    if (res.ok) {
      return await res.json();
    } else {
      const errData = await res.json();
      throw new Error(errData.error || 'Server error');
    }
  } catch (err) {
    console.warn('Failed to save order to database, using local fallback:', err);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return {
      id: `CL-2026-${randomNum}`,
      date: new Date().toLocaleString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      customer: orderPayload.customer,
      items: orderPayload.items,
      subtotal: subtotal,
      shippingCost: currentShippingCost,
      total: total
    };
  }
}

// WhatsApp redirect details builder
function executeWhatsappRedirect(order) {
  const waText = compileWhatsappMessage(order);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
  window.open(whatsappUrl, '_blank');
}

// Instagram redirect details builder
function executeInstagramRedirect(order) {
  let text = `--- COZY LOOP ORDER SHEET ---\n`;
  text += `Order ID: ${order.id}\n`;
  text += `Date: ${order.date}\n\n`;
  text += `CUSTOMER DETAILS\n`;
  text += `• Name: ${order.customer.name}\n`;
  text += `• Phone: ${order.customer.phone}\n`;
  text += `• Address: ${order.customer.address}, ${order.customer.postcode} ${order.customer.city}, ${order.customer.state}\n\n`;
  
  text += `ORDER ITEMS\n`;
  order.items.forEach((item, index) => {
    text += `${index + 1}. *${item.name}* x${item.quantity} (RM ${item.price.toFixed(2)} ea)\n`;
    if (item.options?.attach && item.options.attach !== 'None') {
      text += `   - Attachment: ${item.options.attach}\n`;
    }
    if (item.options?.notes) {
      text += `   - Color/Notes: ${item.options.notes}\n`;
    }
    if (item.customDetails) {
      text += `   - Description: ${item.customDetails}\n`;
    }
    text += `   Subtotal: RM ${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  text += `\nTOTAL SUMMARY\n`;
  text += `• Subtotal: RM ${order.subtotal.toFixed(2)}\n`;
  text += `• Shipping: RM ${order.shippingCost.toFixed(2)}\n`;
  text += `• Total Amount: RM ${order.total.toFixed(2)}\n\n`;
  text += `Thank you!`;

  navigator.clipboard.writeText(text).then(() => {
    alert("Order details copied to clipboard! Redirecting to Instagram...");
    window.open("https://instagram.com/cozyloop_2212", "_blank");
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    window.open("https://instagram.com/cozyloop_2212", "_blank");
  });
}

function compileWhatsappMessage(order) {
  let text = `Hello Cozy Loop!\nI'd like to place an order from your website.\n\n`;
  text += `*ORDER ID*: ${order.id}\n`;
  text += `*DATE*: ${order.date}\n\n`;
  text += `*CUSTOMER DETAILS*\n`;
  text += `• Name: ${order.customer.name}\n`;
  text += `• Phone: ${order.customer.phone}\n`;
  text += `• Address: ${order.customer.address}, ${order.customer.postcode} ${order.customer.city}, ${order.customer.state}\n\n`;
  
  text += `*ORDER ITEMS*\n`;
  order.items.forEach((item, index) => {
    text += `${index + 1}. *${item.name}* x${item.quantity} (RM ${item.price.toFixed(2)} ea)\n`;
    if (item.options?.attach && item.options.attach !== 'None') {
      text += `   - Attachment: ${item.options.attach}\n`;
    }
    if (item.options?.notes) {
      text += `   - Color/Notes: ${item.options.notes}\n`;
    }
    if (item.customDetails) {
      text += `   - Description: ${item.customDetails}\n`;
    }
    text += `   Subtotal: RM ${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  text += `\n*TOTAL SUMMARY*\n`;
  text += `• Subtotal: RM ${order.subtotal.toFixed(2)}\n`;
  text += `• Shipping: RM ${order.shippingCost.toFixed(2)}\n`;
  text += `• *Total Amount: RM ${order.total.toFixed(2)}*\n\n`;
  text += `Thank you!`;
  
  return encodeURIComponent(text);
}

// Simulated receipt compiler
function generateReceiptData(order) {
  activeOrder = order;

  const recOrderId = document.getElementById('recOrderId');
  const recDate = document.getElementById('recDate');
  const recName = document.getElementById('recCustomerName');
  const recPhone = document.getElementById('recCustomerPhone');
  const recAddress = document.getElementById('recCustomerAddress');
  const receiptBody = document.getElementById('receiptItemsBody');

  if (recOrderId) recOrderId.textContent = order.id;
  if (recDate) recDate.textContent = order.date;
  if (recName) recName.textContent = order.customer.name;
  if (recPhone) recPhone.textContent = order.customer.phone;
  if (recAddress) recAddress.textContent = `${order.customer.address}, ${order.customer.postcode} ${order.customer.city}, ${order.customer.state}`;

  if (receiptBody) {
    receiptBody.innerHTML = order.items.map(item => {
      let customLabel = '';
      if (item.options?.attach && item.options.attach !== 'None') {
        customLabel += `<div class="rec-item-opt">• Attachment: ${item.options.attach}</div>`;
      }
      if (item.options?.notes) {
        customLabel += `<div class="rec-item-opt">• Customization: ${item.options.notes}</div>`;
      }
      if (item.customDetails) {
        customLabel += `<div class="rec-item-opt">• Description: ${item.customDetails}</div>`;
      }
      
      return `
        <tr>
          <td>
            <div class="rec-item-name" style="font-weight: 700;">${item.name}</div>
            ${customLabel}
          </td>
          <td style="text-align: center; padding: 4px 0;">${item.quantity}</td>
          <td style="text-align: right; padding: 4px 0;">RM ${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`;
    }).join('');
  }

  const recSubtotal = document.getElementById('recSubtotal');
  const recShipping = document.getElementById('recShipping');
  const recTotal = document.getElementById('recTotal');

  if (recSubtotal) recSubtotal.textContent = `RM ${order.subtotal.toFixed(2)}`;
  if (recShipping) recShipping.textContent = `RM ${order.shippingCost.toFixed(2)}`;
  if (recTotal) recTotal.textContent = `RM ${order.total.toFixed(2)}`;
}

// Copy receipt detail sheet text
function copyReceiptText() {
  if (!activeOrder) return;
  const orderId = activeOrder.id;
  const date = activeOrder.date;
  const customer = activeOrder.customer.name;
  const phone = activeOrder.customer.phone;
  const address = `${activeOrder.customer.address}, ${activeOrder.customer.postcode} ${activeOrder.customer.city}, ${activeOrder.customer.state}`;
  const subtotal = activeOrder.subtotal.toFixed(2);
  const shipping = activeOrder.shippingCost.toFixed(2);
  const total = activeOrder.total.toFixed(2);

  let copyText = `--- COZY LOOP ORDER RECEIPT ---\n`;
  copyText += `Order ID: ${orderId}\n`;
  copyText += `Date: ${date}\n\n`;
  copyText += `Customer: ${customer}\n`;
  copyText += `Phone: ${phone}\n`;
  copyText += `Address: ${address}\n\n`;
  copyText += `ITEMS:\n`;

  activeOrder.items.forEach(item => {
    copyText += `- ${item.name} x${item.quantity} (RM ${item.price.toFixed(2)} ea)\n`;
    if (item.options?.attach && item.options.attach !== 'None') {
      copyText += `  Attachment: ${item.options.attach}\n`;
    }
    if (item.options?.notes) {
      copyText += `  Note: ${item.options.notes}\n`;
    }
    if (item.customDetails) {
      copyText += `  Details: ${item.customDetails}\n`;
    }
  });

  copyText += `\nSubtotal: RM ${subtotal}\n`;
  copyText += `Shipping: RM ${shipping}\n`;
  copyText += `Total Paid: RM ${total}\n`;
  copyText += `-------------------------------\n`;
  copyText += `Thank you for shopping at Cozy Loop!`;

  navigator.clipboard.writeText(copyText).then(() => {
    const copyBtn = document.getElementById('btnCopyReceipt');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'COPIED TO CLIPBOARD!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// ===================================================================
// GSAP ANIMATION ENGINE — Cinematic Scroll Reveals
// Taste Skill: Award-level motion design
// ===================================================================

(function initGSAPAnimations() {
  // Guard: only run if GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero headline entrance (fade in + scale up)
  gsap.utils.toArray('.gsap-fade').forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, scale: 0.92 },
      { 
        opacity: 1, scale: 1, duration: 1.2, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true
        }
      }
    );
  });

  // Section reveal (slide up + fade)
  gsap.utils.toArray('.gsap-reveal').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: 0.9,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      }
    );
  });

  // Scale-in elements (images, cards)
  gsap.utils.toArray('.gsap-scale').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1, scale: 1, duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // Slide from left
  gsap.utils.toArray('.gsap-slide-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -80 },
      {
        opacity: 1, x: 0, duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // Slide from right
  gsap.utils.toArray('.gsap-slide-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 80 },
      {
        opacity: 1, x: 0, duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // Product items stagger animation
  const productItems = gsap.utils.toArray('.product-item');
  if (productItems.length) {
    productItems.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            once: true
          }
        }
      );
    });
  }

  // Parallax effect on hero sections
  gsap.utils.toArray('.hero').forEach(hero => {
    gsap.to(hero, {
      backgroundPosition: '50% 30%',
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  // Image hover parallax via scroll (about section images)
  gsap.utils.toArray('.about__photo-wrapper img').forEach(img => {
    gsap.fromTo(img,
      { scale: 1.12 },
      {
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.about'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );
  });

  // Filter buttons animation on shop page
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    gsap.fromTo(filterBtns,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.shop-controls',
          start: 'top 90%',
          once: true
        }
      }
    );
  }

  // Marquee speed modulation on scroll
  const marqueeSection = document.querySelector('.marquee-skewed');
  if (marqueeSection) {
    gsap.to('.marquee-row__track', {
      x: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: marqueeSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  }

  // Scroll indicator rotation speed boost on scroll
  const scrollIndicator = document.querySelector('.scroll-indicator__svg');
  if (scrollIndicator) {
    gsap.to(scrollIndicator, {
      rotation: 720,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // Nav background opacity on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => {
        if (self.direction === 1) {
          nav.style.borderBottomColor = 'rgba(245, 240, 235, 0.12)';
        } else {
          nav.style.borderBottomColor = 'rgba(245, 240, 235, 0.08)';
        }
      }
    });
  }

})();
