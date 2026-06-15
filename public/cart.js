/* ============================================================
   RegenX x Eric Favre - Panier (cart.js)
   Panier statique en localStorage avec gestion des variantes
   (saveur), versioning, et checkout Stripe via /api/stripe/checkout
   Modele inspire du systeme "Les Jardins Enchantes".
   ============================================================ */
(function (window) {
  'use strict';

  // Incrementer cette version purge les anciens paniers (ex: si les prix changent)
  var CART_VERSION = 'regenx-v1';
  var STORAGE_KEY = 'regenx_cart';
  var VERSION_KEY = 'regenx_cart_version';

  /* ---------- Stockage ---------- */
  function loadCart() {
    try {
      if (localStorage.getItem(VERSION_KEY) !== CART_VERSION) {
        localStorage.setItem(VERSION_KEY, CART_VERSION);
        localStorage.setItem(STORAGE_KEY, '[]');
        return [];
      }
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    localStorage.setItem(VERSION_KEY, CART_VERSION);
    updateCartCount();
  }

  /* ---------- Cle d'unicite : un produit + une saveur = une ligne ---------- */
  function lineKey(item) {
    return item.id + '::' + (item.variant || '');
  }

  /* ---------- API publique ---------- */
  // addToCart({ id, name, priceId, price, variant, image })
  function addToCart(product) {
    if (!product || !product.id || !product.priceId) {
      console.warn('addToCart: produit invalide', product);
      return;
    }
    var cart = loadCart();
    var key = lineKey(product);
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (lineKey(cart[i]) === key) { existing = cart[i]; break; }
    }
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name || product.id,
        priceId: product.priceId,
        price: typeof product.price === 'number' ? product.price : 0,
        variant: product.variant || '',
        image: product.image || '',
        qty: 1
      });
    }
    saveCart(cart);
  }

  // Variante "taille/saveur" lue depuis un bouton (compat Jardins Enchantes)
  function addToCartWithSize(btn) {
    var scope = btn.closest('[data-product]') || document;
    var checked = scope.querySelector('input[name="flavor"]:checked, input[name="size"]:checked');
    var variant = checked ? checked.value : '';
    var priceId = (checked && checked.getAttribute('data-price-id')) || btn.getAttribute('data-price-id');
    addToCart({
      id: btn.getAttribute('data-id'),
      name: btn.getAttribute('data-name'),
      priceId: priceId,
      price: parseFloat(btn.getAttribute('data-price')) || 0,
      variant: variant,
      image: btn.getAttribute('data-image') || ''
    });
  }

  function setQty(key, qty) {
    var cart = loadCart();
    for (var i = 0; i < cart.length; i++) {
      if (lineKey(cart[i]) === key) {
        cart[i].qty = Math.max(1, qty);
        break;
      }
    }
    saveCart(cart);
  }

  function removeItem(key) {
    var cart = loadCart().filter(function (it) { return lineKey(it) !== key; });
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
  }

  function cartTotal() {
    return loadCart().reduce(function (sum, it) {
      return sum + (it.price || 0) * (it.qty || 1);
    }, 0);
  }

  function cartCount() {
    return loadCart().reduce(function (n, it) { return n + (it.qty || 1); }, 0);
  }

  function updateCartCount() {
    var n = cartCount();
    document.querySelectorAll('#cart-count, .cart-count').forEach(function (el) {
      el.textContent = n;
    });
  }

  /* ---------- Checkout Stripe ---------- */
  // Envoie le panier a /api/stripe/checkout. La saveur (variant) est
  // transmise dans le nom ET en metadata pour apparaitre dans la commande.
  function checkout() {
    var cart = loadCart();
    if (!cart.length) {
      alert('Votre panier est vide.');
      return;
    }
    var items = cart.map(function (it) {
      return {
        priceId: it.priceId,
        quantity: it.qty || 1,
        name: it.variant ? (it.name + ' - ' + it.variant) : it.name,
        variant: it.variant || '',
        productId: it.id
      };
    });

    var btns = document.querySelectorAll('[data-checkout]');
    btns.forEach(function (b) { b.disabled = true; });

    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.url) {
          window.location.href = data.url;
        } else {
          alert('Erreur lors de la creation du paiement.');
          btns.forEach(function (b) { b.disabled = false; });
        }
      })
      .catch(function (err) {
        console.error(err);
        alert('Erreur reseau lors du paiement.');
        btns.forEach(function (b) { b.disabled = false; });
      });
  }

  /* ---------- Exposition globale ---------- */
  window.RegenXCart = {
    load: loadCart, save: saveCart, add: addToCart, addWithSize: addToCartWithSize,
    setQty: setQty, remove: removeItem, clear: clearCart,
    total: cartTotal, count: cartCount, updateCount: updateCartCount,
    checkout: checkout, lineKey: lineKey
  };
  window.addToCart = addToCart;
  window.addToCartWithSize = addToCartWithSize;
  window.updateCartCount = updateCartCount;

  document.addEventListener('DOMContentLoaded', updateCartCount);
})(window);
