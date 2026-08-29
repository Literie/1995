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

  // Capture du numéro de téléphone même si la réservation n'est pas finalisée.
  // Dès que la personne quitte le champ téléphone avec un numéro plausible,
  // on envoie discrètement ces coordonnées à Formspree (même formulaire que
  // la réservation, avec un statut différent), pour pouvoir la rappeler
  // même si elle ferme la page sans valider.
  document.querySelectorAll('.order-form').forEach((form) => {
    const telInput = form.querySelector('input[name="telephone"]');
    if (!telInput) return;
    let dernierNumeroEnvoye = '';
    let dejaSoumis = false;

    form.addEventListener('submit', () => {
      dejaSoumis = true; // évite un envoi "abandon" redondant si la vraie soumission part juste après
    });

    telInput.addEventListener('blur', () => {
      const valeur = telInput.value.trim();
      const chiffres = valeur.replace(/\D/g, '');
      if (dejaSoumis || chiffres.length < 6 || valeur === dernierNumeroEnvoye) return;
      dernierNumeroEnvoye = valeur;

      const data = new FormData();
      data.append('produit', form.querySelector('input[name="produit"]')?.value || '');
      data.append('nom', form.querySelector('input[name="nom"]')?.value || '');
      data.append('telephone', valeur);
      data.append('statut', 'Panier non finalisé — numéro capturé automatiquement');
      data.append('_subject', 'Réservation potentiellement abandonnée — à rappeler');

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      }).catch(() => {
        /* échec silencieux : on ne bloque jamais la navigation du visiteur */
      });
    });
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
