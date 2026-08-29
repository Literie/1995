# Linge Maison Univers — site vitrine

Site statique (HTML/CSS/JS, sans framework) fait pour être hébergé gratuitement sur **GitHub Pages**.

## 1. Mettre le site en ligne (GitHub Pages)

Le site est volontairement **100% plat : aucun sous-dossier**. Tous les fichiers (`index.html`, `style.css`, `main.js`, chaque page produit, les images...) sont à la racine. C'est fait exprès : l'interface web de GitHub ("Add file → Upload files") ne permet de sélectionner que des **fichiers**, jamais un dossier entier — avec cette structure plate, tu n'as jamais besoin d'uploader un dossier.

**Sans utiliser de ligne de commande (le plus simple) :**
1. Crée un dépôt GitHub (public).
2. Sur la page du dépôt, clique **"Add file" → "Upload files"**.
3. Ouvre le dossier de ce site sur ton ordinateur, sélectionne **tous les fichiers** à l'intérieur (Ctrl+A / Cmd+A — ce sont bien des fichiers, pas de dossier), et dépose-les dans la zone d'upload. Vérifie dans la liste qui s'affiche qu'il n'y a que des noms de fichiers simples (`style.css`, `index.html`, `parure-satin-ivoire.svg`...), sans aucun `/` dedans.
4. Clique **"Commit changes"**.
5. Va dans **Settings → Pages → Build and deployment → Source : "Deploy from a branch"**, choisis la branche `main` et le dossier `/ (root)`, puis **Save**.
6. Après 1-2 minutes, ton site est en ligne. Recharge avec un rafraîchissement forcé (Ctrl+F5 / Cmd+Maj+R) pour éviter le cache du navigateur.

**Avec git en ligne de commande (si tu es à l'aise) :**
```bash
git init
git add .
git commit -m "Site initial"
git branch -M main
git remote add origin https://github.com/VOTRE-PSEUDO/VOTRE-DEPOT.git
git push -u origin main
```

Le fichier `.nojekyll` est déjà présent (nécessaire pour que GitHub Pages ne traite pas le site avec Jekyll, ce qui pourrait perturber certains fichiers).

## 2. Configurer tes vraies informations

Tout se modifie dans **`products.json`**, section `"brand"` :

| Champ | À quoi ça sert |
|---|---|
| `phoneDisplay` / `phoneWhatsapp` | Numéro affiché / numéro utilisé pour le bouton "Commander via WhatsApp" (format international sans `+` ni espaces pour `phoneWhatsapp`, ex. `33612345678`) |
| `email`, `address` | Affichés dans le footer |
| `siteUrl` | **Important :** l'URL exacte de ton site GitHub Pages, sans `/` final (ex. `https://jdupont.github.io/linge-maison-univers`). Tous les liens internes (CSS, JS, images, pages) sont calculés à partir de cette valeur — c'est elle qui évite les erreurs 404. |
| `formspreeOrderId` | Voir étape 3 — reçoit les réservations |
| `formspreeNewsletterId` | Voir étape 3 — reçoit les inscriptions newsletter |

⚠️ **`siteUrl` doit être renseigné avec ta vraie adresse GitHub Pages *avant* de lancer `node scripts/generate.mjs`.** C'est ce qui permet à chaque page de construire des liens absolus corrects vers `style.css`, `main.js`, les images, etc. Si tu laisses le texte d'exemple (`VOTRE-PSEUDO`/`VOTRE-DEPOT`), le script t'avertit dans la console et les ressources ne se chargeront pas une fois en ligne.

Après modification, régénère le site (voir étape 4).

## 3. Recevoir les commandes et les inscriptions à la newsletter (Formspree)

Le site est 100% statique : il n'y a pas de serveur pour stocker les commandes. Le formulaire de réservation et le formulaire newsletter utilisent donc **Formspree** (gratuit jusqu'à 50 soumissions/mois), qui envoie chaque soumission par e-mail.

1. Crée un compte sur https://formspree.io
2. Crée un premier formulaire "Réservation commande" → copie son identifiant (ex. `xyzabc12`) → colle-le dans `formspreeOrderId`.
3. Crée un second formulaire "Newsletter" → copie son identifiant → colle-le dans `formspreeNewsletterId`.
4. Régénère le site (étape 4). Le premier envoi de chaque formulaire demande une confirmation Formspree par e-mail : valide-la.

**Alternative sans Formspree** : sur chaque fiche produit, le bouton **"Commander via WhatsApp"** fonctionne déjà sans aucune configuration de service tiers (juste le numéro WhatsApp de l'étape 2) — c'est l'option la plus simple si tu veux gérer les réservations uniquement par WhatsApp/téléphone.

## 4. Ajouter, modifier ou supprimer un produit

Tout est piloté par **`products.json`** (un objet par produit : nom, prix, couleurs, description, `metaTitle`, `metaDescription`, image...).

1. Modifie `products.json` (duplique un bloc produit existant pour en ajouter un nouveau, en changeant au minimum `id` et `slug`).
2. Régénère les pages :
   ```bash
   node scripts/generate.mjs
   ```
   Cela recrée `index.html`, une page `<slug>.html` par produit, `sitemap.xml`, etc., **à plat, sans sous-dossier**. **Ne modifie jamais ces fichiers générés à la main** — modifie `products.json` puis relance le script, sinon tes changements seront écrasés à la prochaine génération.

   *(Ce script est dans `scripts/generate.mjs` — c'est le seul fichier du zip qui est dans un sous-dossier. Tu n'as pas besoin de l'uploader sur GitHub si tu ne comptes pas régénérer le site toi-même depuis ce dépôt ; garde-le simplement sur ton ordinateur pour tes futures modifications.)*
3. Remplace l'image provisoire (`<slug>.svg`, un visuel généré automatiquement) par une vraie photo produit : ajoute ta photo à côté des autres fichiers puis change le champ `"image"` du produit dans `products.json` (ex. `"parure-satin-ivoire.jpg"`, toujours sans `/` — un simple nom de fichier).
4. Ré-uploade les fichiers modifiés/ajoutés sur GitHub (via "Add file → Upload files", ou `git add . && git commit -m "Mise à jour produits" && git push` si tu utilises git).

## 5. Ce qui est déjà en place

- **Page d'accueil** : hero, grille des 10 produits, section "comment ça marche".
- **Une page par produit** avec sa propre balise `<title>` (meta title) et `<meta name="description">` (meta description), + données structurées `schema.org/Product` pour le référencement.
- **Rappel du fonctionnement "paiement à la livraison"** affiché à 4 endroits : bandeau en haut de chaque page, fiche produit, fenêtre de réservation, page de remerciement.
- **Réservation** : bouton "Réserver" → fenêtre avec WhatsApp pré-rempli, appel direct, ou formulaire (nom, téléphone, ville, adresse, couleur, quantité).
- **Footer** avec contact + formulaire newsletter (e-mail).
- **Responsive**, focus clavier visible, animations réduites si l'utilisateur le demande (`prefers-reduced-motion`).

## 6. Limites à connaître

- Site 100% statique : pas de compte client, pas de vrai panier multi-produits, pas de stock en temps réel. Pour ce volume (10 produits, réservation + rappel téléphonique), ce n'est pas nécessaire.
- Les visuels produits sont des **placeholders SVG** générés automatiquement (pas de vraies photos) — à remplacer avant la mise en ligne définitive.
- Formspree gratuit est limité à 50 soumissions/mois ; au-delà, il existe des offres payantes ou d'autres services équivalents (Getform, Web3Forms...).
