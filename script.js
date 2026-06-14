document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const products = {
  treats: [
    { name: 'Matcha Strawberry Swiss Roll', img: 'matcha-strawberry', price: 'RM 10.50' },
    { name: 'Orange Swiss Roll', img: 'orange-swiss', price: 'RM 10.50' },
    { name: 'Blueberry Swiss Roll', img: 'blueberry-swiss', price: '' },
    { name: 'Mini Chocolate Cake', img: 'mini-choc-cake', price: 'RM 6.50' },
    { name: 'Mini Taro Cake', img: 'mini-taro-cake', price: '' },
    { name: 'Mini Birthday Cake', img: 'mini-birthday-cake', price: 'RM 6.50' },
    { name: 'Mini Caramel Pudding', img: 'caramel-pudding', price: '' },
  ],
  paws: [
    { name: 'Mini Bear Keychain', img: 'mini-bear', price: 'RM 10.50', sub: 'per piece' },
    { name: 'Mushy Mushroom', img: 'mushy-mushroom', price: 'RM 10.50', sub: 'custom hat colour & design' },
    { name: 'Duck Keychain', img: 'duck', price: 'RM 6.50' },
    { name: 'Grey Cat Keychain', img: 'grey-cat', price: 'RM 6.50' },
    { name: 'Black Cat Keychain', img: 'black-cat', price: 'RM 6.50' },
    { name: 'White Cat Keychain', img: 'white-cat', price: 'RM 6.50' },
    { name: 'Baby Chick', img: 'baby-chick', price: 'RM 5.50' },
    { name: 'Twin Tulip Keychain', img: 'twin-tulip', price: 'RM 5.50' },
  ],
  accessories: [
    { name: 'Flower Bouquet', img: 'flower-bouquet', price: 'RM 5.50' },
    { name: 'Scrunchie', img: 'scrunchie', price: 'RM 4.00', sub: 'per piece' },
    { name: 'Hair Clip', img: 'hair-clip', price: 'RM 3.50' },
    { name: 'Claw Clip', img: 'claw-clip', price: 'RM 3.50' },
  ],
};

function card(p) {
  const sub = p.sub ? `<span class="card__sub">${p.sub}</span>` : '';
  const price = p.price
    ? `<span class="card__price">${p.price}</span>`
    : `<span class="card__price card__price--dm">DM for price</span>`;
  return `
    <article class="card">
      <div class="card__media"><img src="images/${p.img}.jpg" alt="${p.name}" loading="lazy" /></div>
      <div class="card__body">
        <div><span class="card__name">${p.name}</span>${sub}</div>
        ${price}
      </div>
    </article>`;
}

Object.entries(products).forEach(([cat, items]) => {
  const grid = document.getElementById('grid-' + cat);
  if (grid) grid.innerHTML = items.map(card).join('');
});
