// Linge Maison Univers — script principal (vanilla JS, sans dépendance)
document.addEventListener('DOMContentLoaded', () => {
  // Année dans le footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Menu mobile
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Sélecteur de couleur (visuel uniquement — la couleur choisie est envoyée via le formulaire)
  document.querySelectorAll('.swatch').forEach((sw) => {
    sw.addEventListener('click', () => {
      sw.parentElement.querySelectorAll('.swatch').forEach((s) => s.classList.remove('is-selected'));
      sw.classList.add('is-selected');
      const select = document.querySelector('.order-form select[name="couleur"]');
      if (select) select.value = sw.getAttribute('title');
    });
  });

  // Ouverture / fermeture des modales de réservation
  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.getAttribute('data-open-modal'));
      if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.querySelectorAll('[data-close]').forEach((el) =>
      el.addEventListener('click', () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      })
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // Lien WhatsApp pré-rempli (numéro à définir dans products.json -> brand.phoneWhatsapp)
  document.querySelectorAll('.js-whatsapp-link').forEach((a) => {
    const product = a.getAttribute('data-product') || '';
    const price = a.getAttribute('data-price') || '';
    const phone = (a.getAttribute('data-phone') || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour, je souhaite réserver : ${product} (${price}). Merci de me rappeler pour confirmer ma commande.`
    );
    a.href = `https://wa.me/${phone}?text=${message}`;
  });

  // Apparition progressive des cartes produit au scroll
  const items = document.querySelectorAll('.product-card, .step');
  items.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }
});
