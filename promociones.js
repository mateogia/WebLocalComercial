function readCart(){
  const items = [];
  document.querySelectorAll('#product-list .producto').forEach(p => {
    const price = Number(p.dataset.price) || 0;
    const id = p.dataset.id;
    const category = p.dataset.category || 'general';
    const cantidad = Number(p.querySelector('.cantidad').value) || 0;
    
    if (cantidad > 0) items.push({id, price, cantidad, category});
  });
  return items;
}

function calcRaw(items){
  return items.reduce((s,it) => s + it.price * it.cantidad, 0);
}

function applyPromo(items){
  let discount = 0;

  items.forEach(it => {
    const pairs = Math.floor(it.cantidad / 2);

    if (pairs > 0) {
        if (it.category === 'pizzas-congeladas'){
            discount += pairs * (it.price * 0.30);
        } else {
            discount += pairs * (it.price * 0.50);
        }
    }
  });

  const raw = calcRaw(items);
  if (raw > 20000){
    discount += raw * 0.10;
  }

  return Math.min(raw, Math.round(discount));
}

function updateUI(raw, discount){
  const final = Math.max(0, raw - discount);
  document.getElementById('raw').textContent = raw;
  document.getElementById('discount').textContent = discount; 
  document.getElementById('final').textContent = final;
}

function runCalculation(){
    const items = readCart();
    const raw = calcRaw(items);
    const discount = applyPromo(items);
    updateUI(raw, discount);
}

document.querySelectorAll('#product-list .cantidad').forEach(el => {
  el.addEventListener('input', runCalculation);
});