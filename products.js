/* =====================================================================
   HIMALAYAN SWONIGA HARVEST — PRODUCT CATALOGUE
   ---------------------------------------------------------------------
   This one file controls every product on the site (home page cards
   and the product detail pages). No backend — just edit and save.

   HOW TO UPDATE A PRODUCT PHOTO
     1. Put the new photo in the  products/  folder with the SAME file
        name (e.g. products/garlic_powder.jpg). Square photos look best.
     2. Double-click  update-images.bat  — it makes a web-sized copy in
        images/products/ which the site uses.
     3. Refresh the browser.

   HOW TO ADD A PRODUCT
     1. Add its photo to products/ and run update-images.bat.
     2. Copy one of the product blocks below, give it a new id, and set
        images: ["images/products/<file name>.jpg"].
     3. Add the id to FEATURED and/or POPULAR if it should show on the
        home page.

   EXTRA GALLERY PHOTOS
     Add more paths to a product's  images  list — the first one is the
     main photo, the rest become thumbnails on the detail page.
   ===================================================================== */

// Which products appear on the home page, in order.
// The first FEATURED product is shown as the large card.
const FEATURED = ["lapsi-powder", "garlic-powder", "beetroot-powder", "apple-slices", "orange-slices"];
const POPULAR = [
  "lemon-powder", "lemon-slices", "ginger-powder", "amla-powder",
  "orange-powder", "garlic-powder", "lapsi-powder", "beetroot-powder",
];

// Shop-wide settings — edit to match your real policies.
const STORE = {
  instagram: "himalayanswonigaharvest", // username without "@" — used for "Order on Instagram"
  // whatsapp: "9779802311111", // PHONE HIDDEN — international format, no "+"
  assurances: [
    { icon: "🚚", title: "Delivery", sub: "Across Nepal · 1–5 days" },
    { icon: "💵", title: "Cash on Delivery", sub: "Pay when it arrives" },
    { icon: "📦", title: "Bulk Orders", sub: "Wholesale pricing" },
  ],
};

// PRICES: add  price: 325  to the 100g pack to show the price on the product detail
// page. Other pack sizes are priced automatically by weight from it (200g = 2 × 100g
// price) — or give a pack its own  price:  to override that (e.g. a bulk discount).
// A product with no price set anywhere shows no price. (Product cards on the
// home page never show prices — see SHOW_PRICE_ON_CARDS below.)
// `was` = original price when on sale (shows a sale badge and the old price crossed out).
// `nutrition` = typical values per 100g — leave it out if you don't have verified figures.
// Reviews are SAMPLE content — replace with real customer reviews before launch.
const PRODUCTS = {
  "lapsi-powder": {
    name: "Lapsi Powder",
    category: "Fruit Powder",
    icon: "🍑",
    images: ["images/products/lapsi_powder.jpg"],
    badge: "Signature",
    sku: "HSH-LAP",
    rating: 5.0,
    reviewCount: 32,
    inStock: true,
    variants: [
      { size: "100g" },
      { size: "200g" },
    ],
    short:
      "Nepal's beloved hog plum — naturally tangy, sun-dried and finely milled. Perfect for achar, chutney and refreshing drinks.",
    description: [
      "Lapsi (Choerospondias axillaris), the Nepali hog plum, grows in the mid-hills of Nepal and has flavoured Newari and hill kitchens for generations. Its bright, puckering sourness is unlike any other fruit.",
      "We collect ripe lapsi from partner farms, remove the stones, dry the pulp and mill it into a fine powder — so you get that authentic sour-sweet tang any time of year, without hours of boiling and pulping.",
    ],
    highlights: [
      "Naturally sour — no citric acid added",
      "Made from ripe, hand-picked fruit",
      "Dried and finely milled",
      "No sugar, salt or preservatives",
    ],
    ingredients: "100% lapsi (hog plum) fruit pulp.",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    usage: [
      "Stir 1–2 tsp into tomato or sesame achar for a tangy kick.",
      "Mix with sugar, salt and chilli for a quick lapsi chutney.",
      "Add ½ tsp to a glass of cold water with honey for a refreshing drink.",
      "Sprinkle over fruit chaat, pickles or roasted snacks.",
    ],
    storage:
      "Store in a cool, dry place away from sunlight. Reseal the pouch tightly after every use and always use a dry spoon.",
    shelfLife: "12 months from packing",
    origin: "Mid-hills of Nepal",
    process: "Dried, fine-milled",
    reviews: [
      { name: "Sabina M.", rating: 5, date: "2026-08-14", text: "Tastes exactly like the lapsi achar my grandmother made. Saves so much time." },
      { name: "Rohan K.", rating: 5, date: "2026-07-30", text: "Very tangy and fresh. The packaging keeps it dry even in monsoon." },
    ],
  },

  "garlic-powder": {
    name: "Garlic Powder",
    category: "Spice Powder",
    icon: "🧄",
    images: ["images/products/garlic_powder.jpg"],
    badge: "Bestseller",
    sku: "HSH-GAR",
    rating: 4.9,
    reviewCount: 41,
    inStock: true,
    variants: [
      { size: "100g" },
      { size: "200g" },
    ],
    short:
      "Intensely aromatic Himalayan garlic — dried and finely milled. No salt, no fillers, just pure garlic.",
    description: [
      "Highland garlic grown in cooler mountain climates develops smaller cloves with a stronger, more pungent flavour. We peel, slice and dry it slowly to lock in that aroma, then mill it into a fine, free-flowing powder.",
      "One teaspoon replaces roughly two fresh cloves — ideal for marinades, dry rubs, soups, momo filling and everyday tarkari.",
    ],
    highlights: [
      "Strong, pungent highland garlic",
      "No salt, starch or anti-caking agents",
      "1 tsp ≈ 2 fresh cloves",
      "Dual-dried for consistent quality",
    ],
    ingredients: "100% dehydrated garlic (Allium sativum).",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    nutrition: [
      ["Energy", "331 kcal"],
      ["Protein", "16.6 g"],
      ["Carbohydrate", "72.7 g"],
      ["Dietary fibre", "9.0 g"],
      ["Fat", "0.7 g"],
    ],
    usage: [
      "Add ½–1 tsp to momo filling, marinades and dry rubs.",
      "Stir into soups, dal and curries in the last few minutes of cooking.",
      "Mix with butter and herbs for quick garlic bread.",
      "Sprinkle on popcorn, fries or roasted vegetables.",
    ],
    storage:
      "Keep in a cool, dry place. Garlic powder absorbs moisture quickly — reseal immediately and never use a wet spoon.",
    shelfLife: "12 months from packing",
    origin: "Highland farms, Nepal",
    process: "Sun-dried & machine-dried, fine-milled",
    reviews: [
      { name: "Prakash T.", rating: 5, date: "2026-09-02", text: "Much stronger than supermarket garlic powder. A little goes a long way." },
      { name: "Mina G.", rating: 5, date: "2026-08-21", text: "Great for momo achar. No clumping so far." },
      { name: "Deepak R.", rating: 4, date: "2026-08-03", text: "Excellent flavour. Would love a bigger pack for my restaurant." },
    ],
  },

  "ginger-powder": {
    name: "Ginger Powder",
    category: "Spice Powder",
    icon: "🫚",
    images: ["images/products/ginger_powder.jpg"],
    sku: "HSH-GIN",
    rating: 4.8,
    reviewCount: 27,
    inStock: true,
    variants: [
      { size: "100g" },
      { size: "200g" },
    ],
    short:
      "Warm, spicy highland ginger — dual-dried for consistent flavour. Perfect for cooking, tea and baking.",
    description: [
      "Our ginger comes from small farms in Nepal's hills. Mature rhizomes are washed, sliced, dried and milled into a warm, fragrant powder with a clean heat.",
      "Use it in curries and baking, or stir it into hot water with honey and lemon for a soothing winter drink.",
    ],
    highlights: [
      "Warm, clean heat",
      "Great for tea, curries and baking",
      "Sourced from Nepali hill farms",
      "No additives or colours",
    ],
    ingredients: "100% dehydrated ginger (Zingiber officinale).",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    nutrition: [
      ["Energy", "335 kcal"],
      ["Protein", "9.0 g"],
      ["Carbohydrate", "71.6 g"],
      ["Dietary fibre", "14.1 g"],
      ["Fat", "4.2 g"],
    ],
    usage: [
      "Add ½ tsp to milk tea (chiya) while brewing.",
      "Use ¼ tsp in place of 1 tsp fresh grated ginger in curries.",
      "Mix into cookie, cake and gingerbread dough.",
      "Stir into warm water with honey and lemon.",
    ],
    storage: "Store in a cool, dry place away from sunlight. Reseal tightly after use.",
    shelfLife: "12 months from packing",
    origin: "Hill farms, Nepal",
    process: "Sun-dried & machine-dried, fine-milled",
    reviews: [
      { name: "Sunita B.", rating: 5, date: "2026-08-28", text: "My chiya has never tasted better. Very fragrant." },
      { name: "Kiran P.", rating: 5, date: "2026-08-10", text: "Clean ginger heat, no bitterness." },
    ],
  },

  "amla-powder": {
    name: "Amla Powder",
    category: "Fruit Powder",
    icon: "🟢",
    images: ["images/products/amla_powder.jpg"],
    badge: "New",
    sku: "HSH-AML",
    rating: 4.7,
    reviewCount: 16,
    inStock: true,
    variants: [
      { size: "100g" },
      { size: "200g" },
    ],
    short:
      "Tangy Indian gooseberry, dried and milled into a fine powder — a traditional daily wellness staple.",
    description: [
      "Amla (Phyllanthus emblica), the Indian gooseberry, has been part of South Asian kitchens and home remedies for centuries. It is naturally sour with a slightly bitter, astringent finish.",
      "We de-seed fresh amla, dry it gently and mill it fine so it mixes easily into water, juice, smoothies and chutneys.",
    ],
    highlights: [
      "Naturally rich in vitamin C",
      "De-seeded and finely milled",
      "Mixes easily into drinks",
      "No sugar or preservatives",
    ],
    ingredients: "100% dehydrated amla (Indian gooseberry).",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    usage: [
      "Stir ½–1 tsp into a glass of warm water with honey in the morning.",
      "Blend into smoothies and fresh juices.",
      "Mix with salt and chilli for a tangy amla chutney.",
    ],
    storage: "Store airtight in a cool, dry place. Amla powder can clump in humidity — always use a dry spoon.",
    shelfLife: "12 months from packing",
    origin: "Nepal",
    process: "De-seeded, dried, fine-milled",
    reviews: [
      { name: "Anita S.", rating: 5, date: "2026-09-08", text: "Part of my morning routine now. Very fine powder, mixes well." },
      { name: "Bikash N.", rating: 4, date: "2026-08-22", text: "Nice and sour as it should be." },
    ],
  },

  "beetroot-powder": {
    name: "Beetroot Powder",
    category: "Vegetable Powder",
    icon: "🟣",
    images: ["images/products/beetroot_powder.jpg"],
    sku: "HSH-BET",
    rating: 4.8,
    reviewCount: 19,
    inStock: true,
    variants: [
      { size: "100g" },
      { size: "200g" },
    ],
    short:
      "Deep ruby-red beetroot powder with an earthy sweetness — for smoothies, baking and natural food colour.",
    description: [
      "Fresh beetroots are washed, sliced, dried and milled into a vivid magenta powder that keeps the root's natural earthy sweetness.",
      "A spoonful adds colour and flavour to smoothies, and it works beautifully as a natural colouring for cakes, frosting, pasta and rice.",
    ],
    highlights: [
      "Vivid natural colour",
      "Earthy, lightly sweet flavour",
      "Great for smoothies and baking",
      "No added colour or sugar",
    ],
    ingredients: "100% dehydrated beetroot.",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    usage: [
      "Blend 1 tsp into smoothies, juices or lassi.",
      "Use as a natural pink-red colour in frosting, cakes and pancakes.",
      "Knead into dough for coloured roti, pasta or momo wrappers.",
      "Stir into soups and hummus.",
    ],
    storage: "Store airtight in a cool, dark place to keep the colour bright.",
    shelfLife: "12 months from packing",
    origin: "Nepal",
    process: "Dried, fine-milled",
    reviews: [
      { name: "Priya L.", rating: 5, date: "2026-09-10", text: "Made pink momo wrappers for my daughter's birthday — amazing colour!" },
      { name: "Rajan C.", rating: 5, date: "2026-08-17", text: "Great in my morning smoothie." },
    ],
  },

  "orange-powder": {
    name: "Orange Powder",
    category: "Fruit Powder",
    icon: "🍊",
    images: ["images/products/orange_powder.jpg"],
    sku: "HSH-ORP",
    rating: 4.6,
    reviewCount: 14,
    inStock: true,
    variants: [
      { size: "100g", price: 325 },
      { size: "200g" },
    ],
    short:
      "Bright, zesty Nepali orange dried into a fine powder — for drinks, baking and desserts.",
    description: [
      "Nepal's hill oranges are known for their sweet-sharp flavour. We dry ripe fruit and mill it into a bright orange powder that brings instant citrus flavour and aroma to your kitchen.",
    ],
    highlights: [
      "Zesty, natural citrus flavour",
      "Made from Nepali hill oranges",
      "Great for drinks and baking",
      "No sugar or preservatives",
    ],
    ingredients: "100% dehydrated orange.",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    usage: [
      "Stir 1 tsp into cold water or soda with honey for an orange drink.",
      "Add to cake, cookie and muffin batters for citrus flavour.",
      "Sprinkle over yoghurt, oats or fruit salad.",
      "Use in marinades and salad dressings.",
    ],
    storage: "Store airtight in a cool, dry place. Use a dry spoon — fruit powders absorb moisture easily.",
    shelfLife: "12 months from packing",
    origin: "Hill farms, Nepal",
    process: "Dried, fine-milled",
    reviews: [
      { name: "Sanjay L.", rating: 5, date: "2026-08-30", text: "Smells like fresh oranges. Lovely in cakes." },
      { name: "Gita M.", rating: 4, date: "2026-08-05", text: "Nice in cold water on hot days." },
    ],
  },

  "apple-slices": {
    name: "Apple Slices",
    category: "Dried Fruit",
    icon: "🍎",
    images: ["images/products/apple_slices.jpg"],
    sku: "HSH-APS",
    rating: 4.8,
    reviewCount: 23,
    inStock: true,
    variants: [
      { size: "100g" },
      { size: "200g" },
    ],
    short:
      "Crisp, naturally sweet dried apple rings from Himalayan orchards — a wholesome snack with nothing added.",
    description: [
      "Apples from Nepal's high-altitude orchards are cored, sliced into rings and slowly dried until crisp, concentrating their natural sweetness.",
      "Enjoy them straight from the pouch, or add them to breakfast bowls, trail mix and tea.",
    ],
    highlights: [
      "Naturally sweet — no sugar added",
      "From Himalayan orchards",
      "Crisp, chewy texture",
      "Healthy on-the-go snack",
    ],
    ingredients: "100% apple.",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    usage: [
      "Snack straight from the pouch.",
      "Chop over oats, muesli, cereal or yoghurt.",
      "Mix into trail mix with nuts and seeds.",
      "Steep 2–3 rings in hot water with cinnamon for apple tea.",
    ],
    storage: "Reseal tightly after opening and keep in a cool, dry place to stay crisp.",
    shelfLife: "9 months from packing",
    origin: "Himalayan orchards, Nepal",
    process: "Sliced, slow-dried",
    reviews: [
      { name: "Manisha R.", rating: 5, date: "2026-09-12", text: "My kids love these instead of chips." },
      { name: "Hari B.", rating: 5, date: "2026-08-26", text: "Crispy and sweet without any added sugar." },
    ],
  },

  "orange-slices": {
    name: "Orange Slices",
    category: "Dried Fruit",
    icon: "🍊",
    images: ["images/products/orange_slices.jpg"],
    sku: "HSH-ORS",
    rating: 4.7,
    reviewCount: 18,
    inStock: true,
    variants: [
      { size: "100g" },
      { size: "200g" },
    ],
    short:
      "Beautiful dried orange wheels — for tea, drinks, baking and garnish. Bright colour, real citrus aroma.",
    description: [
      "Whole Nepali oranges are thinly sliced into wheels and slowly dried so they keep their jewel-like colour and fragrant peel.",
      "Drop them into tea and drinks, use them to decorate cakes, or enjoy them as a tangy, chewy snack.",
    ],
    highlights: [
      "Whole wheels with peel",
      "Bright colour and citrus aroma",
      "Perfect for tea and garnish",
      "No sugar or preservatives",
    ],
    ingredients: "100% orange.",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    usage: [
      "Add a wheel to black tea, green tea or hot water with honey.",
      "Garnish mocktails, lemonade and cold drinks.",
      "Decorate cakes, tarts and dessert platters.",
      "Snack on them as a tangy treat.",
    ],
    storage: "Keep sealed in a cool, dry place away from sunlight.",
    shelfLife: "9 months from packing",
    origin: "Hill farms, Nepal",
    process: "Sliced, slow-dried",
    reviews: [
      { name: "Srijana K.", rating: 5, date: "2026-09-01", text: "They look so pretty in my tea and cakes." },
      { name: "Ashok P.", rating: 4, date: "2026-08-11", text: "Good aroma. Nice for gifting too." },
    ],
  },

  "lemon-powder": {
    name: "Lemon Powder",
    category: "Fruit Powder",
    icon: "🍋",
    images: ["images/products/lemon_powder.jpg"],
    badge: "New",
    sku: "HSH-LMP",
    rating: 4.7,
    reviewCount: 12,
    inStock: true,
    variants: [
      { size: "100g", price: 250 },
      { size: "200g" },
    ],
    short:
      "Sharp, fresh lemon dried into a fine powder — instant citrus tang for drinks, cooking and baking.",
    description: [
      "Ripe lemons are washed, sliced and dried, then milled into a pale-yellow powder that keeps the bright, sour flavour and fresh aroma of the fruit.",
      "Keep a pouch in the kitchen for whenever a recipe needs a squeeze of lemon — no fresh fruit, no waste.",
    ],
    highlights: [
      "Bright, natural lemon flavour",
      "Instant tang — no squeezing",
      "Great for drinks, cooking and baking",
      "No sugar or preservatives",
    ],
    ingredients: "100% dehydrated lemon.",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    usage: [
      "Stir ½–1 tsp into water or soda with honey for quick lemonade.",
      "Sprinkle over salads, chaat, grilled meat and fish.",
      "Add to marinades, dressings and dips in place of lemon juice.",
      "Mix into cake, cookie and icing recipes for lemon flavour.",
    ],
    storage: "Store airtight in a cool, dry place. Use a dry spoon — fruit powders absorb moisture easily.",
    shelfLife: "12 months from packing",
    origin: "Nepal",
    process: "Dried, fine-milled",
    reviews: [
      { name: "Nisha T.", rating: 5, date: "2026-09-20", text: "So handy for lemonade and salads. Very fresh smell." },
      { name: "Sudip M.", rating: 4, date: "2026-09-14", text: "Nice and tangy. Great for marinades." },
    ],
  },

  "lemon-slices": {
    name: "Lemon Slices",
    category: "Dried Fruit",
    icon: "🍋",
    images: ["images/products/lemon_slices.jpg"],
    badge: "New",
    sku: "HSH-LMS",
    rating: 4.8,
    reviewCount: 10,
    inStock: true,
    variants: [
      { size: "100g" },
      { size: "200g" },
    ],
    short:
      "Golden dried lemon wheels — perfect for tea, drinks, baking and garnish, with a fresh citrus aroma.",
    description: [
      "Whole lemons are thinly sliced into wheels and slowly dried so they keep their sunny colour and fragrant peel.",
      "Drop a slice into hot tea or cold drinks, use them to decorate cakes and desserts, or add them to homemade spice and tea blends.",
    ],
    highlights: [
      "Whole wheels with peel",
      "Fresh citrus aroma",
      "Perfect for tea and garnish",
      "No sugar or preservatives",
    ],
    ingredients: "100% lemon.",
    allergens: "None. Packed in a facility that handles other spices and fruit powders.",
    usage: [
      "Add a slice to black tea, green tea or hot water with honey.",
      "Garnish lemonade, mocktails and cold drinks.",
      "Decorate cakes, tarts and dessert platters.",
      "Blend into homemade herbal tea mixes.",
    ],
    storage: "Keep sealed in a cool, dry place away from sunlight.",
    shelfLife: "9 months from packing",
    origin: "Nepal",
    process: "Sliced, slow-dried",
    reviews: [
      { name: "Kabita R.", rating: 5, date: "2026-09-18", text: "Lovely in my evening tea with honey." },
      { name: "Aman J.", rating: 5, date: "2026-09-09", text: "They look beautiful as cake decoration." },
    ],
  },
};

/* =====================================================================
   SHARED HELPERS — used by index.html and product.html.
   You don't need to edit anything below this line.
   ===================================================================== */

const rs = (n) =>
  "Rs " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const productUrl = (id, size) =>
  "product.html?id=" + id + (size ? "&size=" + encodeURIComponent(size) : "");

// Photo with a graceful fallback: if the image file is missing, a styled
// kraft-pouch placeholder is shown instead of a broken image.
function productImage(p, src, extraAttrs = "") {
  const url = src || (p.images && p.images[0]);
  const fallback = `<div class="pouch"><div class="pouch-label"><span class="pl-icon">${p.icon}</span><span class="pl-name">${p.name}</span><span class="pl-sub">Himalayan Swoniga</span></div></div>`;
  if (!url) return fallback;
  return `<img src="${url}" alt="${p.name} — Himalayan Swoniga Harvest" loading="lazy" decoding="async" ${extraAttrs}
    onerror="this.outerHTML=this.dataset.fallback" data-fallback='${fallback.replace(/'/g, "&#39;")}' />`;
}

// Weight in grams from a size label like "100g" or "1kg".
function sizeInGrams(size) {
  const m = /([\d.]+)\s*(kg|g)\b/i.exec(size);
  return m ? parseFloat(m[1]) * (m[2].toLowerCase() === "kg" ? 1000 : 1) : null;
}

// Price of one pack: its own price if set, otherwise worked out by weight
// from a pack size that has a price. Returns null when there is no price.
function variantPrice(p, v) {
  if (v.price) return v.price;
  const base = p.variants.find((x) => x.price);
  const g = sizeInGrams(v.size);
  const baseG = base && sizeInGrams(base.size);
  return base && g && baseG ? Math.round((base.price * g) / baseG) : null;
}

function badgeFor(p, v) {
  if (!p.inStock) return `<span class="pc-badge oos">Sold Out</span>`;
  if (v.price && v.was) return `<span class="pc-badge sale">-${Math.round((1 - v.price / v.was) * 100)}%</span>`;
  if (p.badge) return `<span class="pc-badge">${p.badge}</span>`;
  return "";
}

// Product card used on the home page and in "Related Products".
function productCard(id, { hero = false } = {}) {
  const p = PRODUCTS[id];
  if (!p) return "";
  const v = p.variants[0];
  const url = productUrl(id);

  // Cards don't show prices — prices appear only on the product detail page.
  // To show them on cards too, set SHOW_PRICE_ON_CARDS to true.
  const SHOW_PRICE_ON_CARDS = false;
  const priceHtml = SHOW_PRICE_ON_CARDS && variantPrice(p, v)
    ? `<div class="pc-price"><span class="pc-now">${rs(variantPrice(p, v))}</span>${v.was ? `<span class="pc-was">${rs(v.was)}</span>` : ""}</div>`
    : `<div class="pc-spacer"></div>`;

  return `<article class="pc reveal${hero ? " hero-pc" : ""}${p.inStock ? "" : " is-oos"}">
      <a class="pc-media" href="${url}">${badgeFor(p, v)}${productImage(p)}</a>
      <div class="pc-body">
        <p class="pc-cat">${p.category} · ${v.size}</p>
        <h3 class="pc-name"><a href="${url}">${p.name}</a></h3>
        ${hero ? `<p class="pc-desc">${p.short}</p>` : ""}
        <div class="pc-rating"><span class="pc-stars" aria-label="${p.rating} out of 5">${stars(p.rating)}</span>${p.rating.toFixed(1)} (${p.reviewCount})</div>
        ${priceHtml}
        ${
          p.inStock
            ? `<button type="button" class="btn btn-dark pc-btn" data-add="${id}">Add To Cart</button>`
            : `<a class="btn btn-outline pc-btn" href="${url}">View Details</a>`
        }
      </div>
    </article>`;
}

// Instagram links: profile page and direct-message (order) link.
const instagramUrl = () => `https://www.instagram.com/${STORE.instagram}/`;
const instagramDm = () => `https://ig.me/m/${STORE.instagram}`;

// Related products: same category first, then the rest.
function relatedProducts(id, count = 4) {
  const cat = PRODUCTS[id].category;
  const others = Object.keys(PRODUCTS).filter((k) => k !== id);
  return [...others.filter((k) => PRODUCTS[k].category === cat), ...others.filter((k) => PRODUCTS[k].category !== cat)].slice(0, count);
}

// Static "Add to cart" feedback (no cart backend yet).
function bindAddButtons(root = document) {
  root.querySelectorAll("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const label = btn.textContent;
      btn.textContent = "✓ Added";
      btn.style.background = "var(--gold)";
      setTimeout(() => {
        btn.textContent = label;
        btn.style.background = "";
      }, 1800);
    }),
  );
}
