/* Bagzone JS - products + cart (INR) */
const PRODUCTS = [
  {id:1, name:'Everyday Tote', price:2199.00, img:'images/tote.jpg', desc:'Spacious tote for daily use.'},
  {id:2, name:'Classic Leather Backpack', price:4999.00, img:'images/backpack.jpg', desc:'Premium faux-leather backpack.'},
  {id:3, name:'Weekend Duffel', price:3599.50, img:'images/duffel.jpg', desc:'Perfect for short trips.'},
  {id:4, name:'Mini Crossbody', price:1499.99, img:'images/crossbody.jpg', desc:'Lightweight and stylish.'},
  {id:5, name:'Laptop Messenger', price:5499.99, img:'images/messenger.jpg', desc:'Carry work in style.'},
  {id:6, name:'Summer Straw Bag', price:1299.20, img:'images/straw.jpg', desc:'Perfect for sunny days.'}
];

function getCart(){try{return JSON.parse(localStorage.getItem('bagzone_cart')||'[]')}catch(e){return []}}
function saveCart(cart){localStorage.setItem('bagzone_cart', JSON.stringify(cart))}
function cartCount(){return getCart().reduce((s,i)=>s+i.qty,0)}
function updateCartLink(){const link=document.getElementById('cart-link'); if(link) link.textContent=`Cart (${cartCount()})`}

function addToCart(id){
  const cart = getCart(); const item = cart.find(i=>i.id===id);
  if(item) item.qty++; else cart.push({id, qty:1});
  saveCart(cart); updateCartLink(); toast('Added to cart');
}

function removeFromCart(id){let cart=getCart(); cart=cart.filter(i=>i.id!==id); saveCart(cart); renderCart(); updateCartLink();}
function changeQty(id, qty){const cart=getCart(); const item=cart.find(i=>i.id===id); if(!item) return; item.qty=Math.max(1, qty); saveCart(cart); renderCart(); updateCartLink();}
function clearCart(){localStorage.removeItem('bagzone_cart'); renderCart(); updateCartLink(); toast('Cart cleared')}

function toast(msg){
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t);
  setTimeout(()=>{t.classList.add('show')},10); setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),300)},2000);
}

// Render functions
function renderProducts(targetId, items){
  const root=document.getElementById(targetId); if(!root) return; root.innerHTML='';
  items.forEach(p=>{
    const el=document.createElement('div'); el.className='card';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-sub">${p.desc}</div>
      </div>
      <div class="card-actions">
        <div class="price">₹${p.price.toFixed(2)}</div>
        <div><button class="btn" onclick="addToCart(${p.id})">Add</button></div>
      </div>
    `;
    root.appendChild(el);
  });
}

function renderCart(){
  const container=document.getElementById('cart-container'); if(!container) return;
  const cart=getCart(); container.innerHTML='';
  if(cart.length===0){ container.innerHTML='<p>Your cart is empty.</p>'; return; }
  let total=0;
  cart.forEach(ci=>{
    const p=PRODUCTS.find(x=>x.id===ci.id);
    const subtotal=p.price*ci.qty; total+=subtotal;
    const item=document.createElement('div'); item.className='cart-item';
    item.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div style="flex:1">
        <div style="font-weight:600">${p.name}</div>
        <div class="card-sub">₹${p.price.toFixed(2)} • Subtotal ₹${subtotal.toFixed(2)}</div>
      </div>
      <div class="qty">
        <button onclick="changeQty(${p.id}, ${ci.qty - 1})">-</button>
        <div>${ci.qty}</div>
        <button onclick="changeQty(${p.id}, ${ci.qty + 1})">+</button>
      </div>
      <div style="margin-left:12px"><button onclick="removeFromCart(${p.id})" class="btn ghost">Remove</button></div>
    `;
    container.appendChild(item);
  });
  const totalEl=document.createElement('div'); totalEl.style.marginTop='12px'; totalEl.innerHTML=`<h3>Total: ₹${total.toFixed(2)}</h3>`;
  container.appendChild(totalEl);
}

function renderCheckout(){const root=document.getElementById('checkout-summary'); if(!root) return; const cart=getCart(); if(cart.length===0){ root.innerHTML='<p>No items in cart.</p>'; return; } let html='<ul>'; let total=0; cart.forEach(ci=>{ const p=PRODUCTS.find(x=>x.id===ci.id); html+=`<li>${p.name} x ${ci.qty} — ₹${(p.price*ci.qty).toFixed(2)}</li>`; total+=p.price*ci.qty; }); html+=`</ul><h3>Total: ₹${total.toFixed(2)}</h3>`; root.innerHTML=html; }

function placeOrder(){ clearCart(); const msg=document.getElementById('order-message'); if(msg){ msg.className=''; msg.textContent='Order placed successfully! (dummy)'; } toast('Order placed (demo)'); }

window.addEventListener('DOMContentLoaded', ()=>{
  updateCartLink();
  renderProducts('featured-grid', PRODUCTS.slice(0,4));
  renderProducts('products-grid', PRODUCTS);
  renderCart(); renderCheckout();

  const placeBtn=document.getElementById('place-order'); if(placeBtn) placeBtn.addEventListener('click', ()=> placeOrder());
  const clearBtn=document.getElementById('clear-cart'); if(clearBtn) clearBtn.addEventListener('click', ()=> { if(confirm('Clear cart?')) clearCart() });

  window.addToCart=addToCart; window.removeFromCart=removeFromCart; window.changeQty=changeQty;
});