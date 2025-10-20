function readCart(){
  const items = [];
  document.querySelectorAll('#product-list .producto').forEach(p => {
    const price = Number(p.dataset.price) || 0;
    const id = p.dataset.id;
    const cantidad = Number(p.querySelector('.cantidad').value) || 0;
    if (cantidad > 0) items.push({id, price, cantidad});
  });
  return items;
}

function calcRaw(items){
  return items.reduce((s,it) => s + it.price * it.cantidad, 0);
}

function applyPromo(items, promo){
  let discount = 0;
  if (promo === 'half-second'){
    let units = [];
    items.forEach(it => { for(let i=0;i<it.cantidad;i++) units.push(it.price); });
    units.sort((a,b)=>a-b);
    for(let i=0;i+1<units.length;i+=2){
      discount += units[i+1] * 0.5;
    }
  } else if (promo === '3x2'){
    items.forEach(it => {
      const el = document.querySelector('#product-list .producto[data-id="'+it.id+'"]');
      const cat = el ? el.dataset.category : '';
      if (cat === 'pizzas-congeladas'){
        const free = Math.floor(it.cantidad / 3);
        discount += free * it.price;
      }
    });
  }

  const raw = calcRaw(items);
  if (raw > 20000){
    discount += raw * 0.10;
  }

  return Math.round(discount);
}

function updateUI(raw, discount){
  const final = Math.max(0, raw - discount);
  document.getElementById('raw').textContent = raw;
  document.getElementById('discount').textContent = discount; 
  document.getElementById('final').textContent = final;
}

document.querySelectorAll('#product-list .cantidad').forEach(el => {
  el.addEventListener('input', ()=>{
    const items = readCart();
    const raw = calcRaw(items);
    const promo = document.querySelector('input[name=promo]:checked').value;
    const discount = applyPromo(items, promo);
    updateUI(raw, discount);
  });
});
