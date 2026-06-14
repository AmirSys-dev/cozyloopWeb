document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const products = {
  treats: [
    { name: 'Blueberry Swiss Roll', emoji: '🫐', price: 'DM for price', thumb: '' },
    { name: 'Orange Swiss Roll', emoji: '🍊', price: 'RM 10.50', thumb: 'b' },
    { name: 'Matcha Strawberry Swiss Roll', emoji: '🍵', price: 'RM 10.50', thumb: 'a' },
    { name: 'Mini Caramel Pudding', emoji: '🍮', price: 'DM for price', thumb: 'b' },
    { name: 'Mini Chocolate Cake', emoji: '🍫', price: 'RM 6.50', thumb: '' },
    { name: 'Mini Taro Cake', emoji: '💜', price: 'DM for price', thumb: 'a' },
    { name: 'Mini Birthday Cake', emoji: '🎂', price: 'RM 6.50', thumb: 'b' },
  ],
  paws: [
    { name: 'Mini Bear Keychain', emoji: '🐻', price: 'RM 10.50', sub: 'per piece', thumb: '' },
    { name: 'Duck Keychain', emoji: '🐤', price: 'RM 6.50', thumb: 'a' },
    { name: 'Grey Cat Keychain', emoji: '🐱', price: 'RM 6.50', thumb: 'b' },
    { name: 'Black Cat Keychain', emoji: '🐈‍⬛', price: 'RM 6.50', thumb: '' },
    { name: 'White Cat Keychain', emoji: '🐈', price: 'RM 6.50', thumb: 'a' },
    { name: 'Baby Chick', emoji: '🐥', price: 'RM 5.50', thumb: 'b' },
    { name: 'Mushy Mushroom', emoji: '🍄', price: 'RM 10.50', sub: 'custom hat colour & design', thumb: '' },
    { name: 'Twin Tulip Keychain', emoji: '🌷', price: 'RM 5.50', thumb: 'a' },
  ],
  accessories: [
    { name: 'Flower Bouquet', emoji: '💐', price: 'RM 5.50', thumb: 'a' },
    { name: 'Hair Clip', emoji: '🌸', price: 'RM 3.50', thumb: '' },
    { name: 'Scrunchie', emoji: '🎀', price: 'RM 4.00', sub: 'per piece', thumb: 'b' },
    { name: 'Claw Clip', emoji: '🪻', price: 'RM 3.50', thumb: 'a' },
  ],
};

function card(p) {
  const thumbClass = p.thumb ? `card__thumb--${p.thumb}` : '';
  const sub = p.sub ? `<span class="card__tag">${p.sub}</span>` : '';
  const priceMain = p.price.startsWith('RM') ? p.price : `<span>${p.price}</span>`;
  return `
    <article class="card">
      <div class="card__thumb ${thumbClass}">${p.emoji}</div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        ${sub}
        <div class="card__price">${priceMain}</div>
      </div>
    </article>`;
}

Object.entries(products).forEach(([cat, items]) => {
  const grid = document.getElementById('grid-' + cat);
  if (grid) grid.innerHTML = items.map(card).join('');
});
