import { products } from '../data/products';

// ─── Intent Types ────────────────────────────────────────────────────────────
const INTENT = {
  BUDGET: 'budget_recommendation',
  USE_CASE: 'use_case_recommendation',
  COMPARE: 'product_comparison',
  SPEC: 'spec_explain',
  CROSS_SELL: 'cross_sell',
  SALES: 'sales_assistance',
  GENERAL: 'general',
};

// ─── Intent Classifier ───────────────────────────────────────────────────────
function classifyIntent(text) {
  const t = text.toLowerCase();

  const budgetTriggers = [
    /\b(budget|cheap|affordable|under|\$|price around|around \$|less than|under |max|most i can spend|have \$\d+|i've got|i have \$)/
    ,
    /\b\d+\s*dollar/
  ];
  const compareTriggers = [/\b(compare|vs|versus|difference between|better|which one|which is|should i get|or\b.*\bor\b)/];
  const specTriggers = [/\b(spec|specs|specification|what does|what's the|mean|explained|explain|definition|understand|technical|tech spec)/];
  const crossSellTriggers = [/\b(combine|also\b|along with|bundle|add on|together|pair|with my|at the same|while i'm at)/];

  if (budgetTriggers.some((r) => r.test(t))) return INTENT.BUDGET;
  if (compareTriggers.some((r) => r.test(t))) return INTENT.COMPARE;
  if (specTriggers.some((r) => r.test(t))) return INTENT.SPEC;
  if (crossSellTriggers.some((r) => r.test(t))) return INTENT.CROSS_SELL;

  // Use-case keywords
  const useCaseTriggers = [
    /\b(gaming|gamer)/, /\b(programming|coding|developer|software)/,
    /\b(videography|video edit|filmmak|content creat)/,
    /\b(music|producer|audio|producer)/,
    /\b(photo|photography|photographer)/,
    /\b(student|college|school)/,
    /\b(business|work|professional|office)/,
    /\b(battery|travel|nomad|digital nomad)/,
    /\b(sleep|health|fit|wellness|fitness)/,
  ];
  if (useCaseTriggers.some((r) => r.test(t))) return INTENT.USE_CASE;

  // Sales keywords
  const salesTriggers = [/\b(warranty|return|shipping|delivery|order|track|refund|guarantee|support|help|contact|payment|buy|where to|how to buy|do you have|in stock|available)/];
  if (salesTriggers.some((r) => r.test(t))) return INTENT.SALES;

  return INTENT.GENERAL;
}

// ─── Product Filters ─────────────────────────────────────────────────────────
function filterByBudget(max) {
  return products.filter((p) => p.price <= max).sort((a, b) => a.price - b.price);
}

function filterByUseCase(useCase) {
  const map = {
    gaming: { categories: ['laptops', 'accessories'], exclude: [], keywords: ['razer', 'rtx', 'gaming', '240hz'] },
    programming: { categories: ['laptops'], exclude: ['gaming'], keywords: ['macbook', 'dell', 'xps', 'intel', 'apple m'] },
    video: { categories: ['laptops'], exclude: [], keywords: ['macbook', 'm2', 'm3', 'oled', 'retina'] },
    music: { categories: ['accessories'], exclude: [], keywords: ['headphone', 'airpod', 'sony', 'audio', 'noise'] },
    photo: { categories: ['phones', 'laptops'], exclude: [], keywords: ['pixel', 'iphone', 'camera', 's24', 'ultra'] },
    student: { categories: ['laptops', 'phones', 'accessories'], exclude: [], keywords: [] },
    fitness: { categories: ['accessories'], exclude: [], keywords: ['watch', 'galaxy', 'health', 'wear'] },
    travel: { categories: ['phones', 'accessories'], exclude: [], keywords: ['battery', 'power bank', 'anker', 'lightning'] },
  };
  const cfg = map[useCase];
  if (!cfg) return [];
  return products.filter((p) => {
    if (!cfg.categories.includes(p.category)) return false;
    return true;
  });
}

// ─── Spec Explainer ──────────────────────────────────────────────────────────
const SPEC_EXPLAIN = {
  'Display': 'The screen size in inches and display technology. OLED and AMOLED produce deeper blacks and vivid colors. Higher refresh rates (120Hz+) make scrolling and animations smoother.',
  'Chip': "The processor — essentially the brain. A newer chip (like A17 Pro, M3, Snapdragon 8 Gen 3) means faster performance, better battery life, and longer software support.",
  'RAM': 'Memory used to run apps simultaneously. More RAM = better multitasking. 8GB is fine for light work; 16GB+ is recommended for video editing, gaming, or running many apps at once.',
  'Storage': 'How much space for apps, photos, and files. Choose at least 256GB to avoid running out. Cloud storage can supplement smaller drives.',
  'Camera': 'Megapixels tell only part of the story. Computational photography (Apple, Google Pixel) often beats higher MP rivals. Look for optical image stabilization and aperture size.',
  'Battery': 'Battery life varies widely with usage. "Up to X hours" is an estimate under controlled conditions — real-world use is usually lower.',
  'GPU': 'The graphics processor. Critical for gaming, 3D rendering, and video editing. NVIDIA RTX series dominates laptops. Integrated graphics (built into the CPU) handles casual work fine.',
  'Noise Cancellation': 'Uses microphones to detect and cancel outside noise. Better for focused work and music in loud environments. Active Noise Cancellation (ANC) is what you want.',
  'Driver': 'The speaker component that produces sound. Larger drivers generally produce deeper bass, but tuning and software matter equally.',
  'Sensor': 'Mouse sensor precision. Higher DPI means the cursor moves further per inch of physical movement. 8000+ DPI is overkill for productivity — more relevant for gaming.',
};

// ─── Response Builders ───────────────────────────────────────────────────────
function formatProduct(p) {
  return `**${p.name}** — $${p.price}${p.originalPrice ? ` (was $${p.originalPrice})` : ''}\n⭐ ${p.rating}/5 (${p.reviews.toLocaleString()} reviews)`;
}

function formatProductList(list) {
  return list.slice(0, 5).map((p) => `• ${formatProduct(p)}`).join('\n\n');
}

function buildBudgetResponse(budget, text) {
  const t = text.toLowerCase();
  const max = parseInt(t.match(/\d+/)?.[0] ?? budget ?? 1000);
  const matched = filterByBudget(max);

  if (matched.length === 0) {
    return `I couldn't find anything under $${max}. Want to stretch your budget slightly? Even $${max + 100} opens up some great options.`;
  }

  const tldr = matched.length === 1
    ? `Here's the best match I found within $${max}:`
    : `Here are ${matched.length} great options under $${max}, sorted by price:`;

  return `${tldr}\n\n${formatProductList(matched)}\n\nWant more details on any of these? I can compare them or explain the specs.`;
}

function buildUseCaseResponse(text) {
  const t = text.toLowerCase();
  let useCase = null;
  if (/\b(gaming|gamer)\b/.test(t)) useCase = 'gaming';
  else if (/\b(programming|coding|developer)\b/.test(t)) useCase = 'programming';
  else if (/\b(videography|video edit|film)\b/.test(t)) useCase = 'video';
  else if (/\b(music|producer|audio)\b/.test(t)) useCase = 'music';
  else if (/\b(photo|photographer)\b/.test(t)) useCase = 'photo';
  else if (/\b(student|college|school)\b/.test(t)) useCase = 'student';
  else if (/\b(fitness|health|wellness|fit)\b/.test(t)) useCase = 'fitness';
  else if (/\b(travel|nomad)\b/.test(t)) useCase = 'travel';

  if (!useCase) return null;

  const matched = filterByUseCase(useCase);
  if (matched.length === 0) return null;

  const intro = {
    gaming: `For serious gaming, you'll want a powerful laptop with a great GPU. Here are my top picks:\n\n`,
    programming: `For coding, prioritize a fast processor, good keyboard, and solid build quality. Here's what I recommend:\n\n`,
    video: `Video editing needs a powerful chip and color-accurate display. Here are the best options:\n\n`,
    music: `For music production, great audio quality and reliable connectivity are key:\n\n`,
    photo: `For photography, prioritize camera quality and color accuracy. These are my picks:\n\n`,
    student: `Great picks for students — balancing performance, portability, and value:\n\n`,
    fitness: `Top choices for tracking your health and fitness:\n\n`,
    travel: `For travel, prioritize battery life and portability:\n\n`,
  };

  return `${intro[useCase]}${formatProductList(matched)}\n\nLet me know your budget and I can narrow these down further!`;
}

function buildComparisonResponse(text) {
  const t = text.toLowerCase();

  // Try to extract two product names
  const allNames = products.map((p) => p.name.toLowerCase());
  const found = allNames.filter((n) => t.includes(n));

  if (found.length < 2) {
    // Find closest match
    const closest = products.find((p) => {
      const n = p.name.toLowerCase();
      return t.includes(n.split(' ')[0]) || t.includes(n.split(' ')[1]);
    });
    if (!closest) return null;
    return `I can definitely help compare products! Which other product would you like to compare **${closest.name}** against?`;
  }

  const p1 = products.find((p) => p.name.toLowerCase() === found[0]);
  const p2 = products.find((p) => p.name.toLowerCase() === found[1]);
  if (!p1 || !p2) return null;

  const rows = [
    ['Price', `$${p1.price}`, `$${p2.price}`],
    ['Rating', `${p1.rating} ⭐`, `${p2.rating} ⭐`],
    ['Category', p1.category, p2.category],
  ];

  // Spec comparison — show keys that differ
  const allKeys = [...new Set([...Object.keys(p1.specs), ...Object.keys(p2.specs)])];
  const specRows = allKeys.map((k) => [k, p1.specs[k] ?? '—', p2.specs[k] ?? '—'])
    .filter(([, a, b]) => a !== b);

  let table = `**${p1.name}** vs **${p2.name}**\n\n`;
  table += `| Feature | ${p1.name} | ${p2.name} |\n`;
  table += `|---------|---------|---------|\n`;
  rows.forEach(([k, a, b]) => { table += `| ${k} | ${a} | ${b} |\n`; });
  specRows.forEach(([k, a, b]) => { table += `| ${k} | ${a} | ${b} |\n`; });

  table += '\n';
  if (p1.price < p2.price) table += `💰 **${p1.name}** is cheaper by $${(p2.price - p1.price).toLocaleString()}.\n`;
  if (p1.rating > p2.rating) table += `⭐ **${p1.name}** has a higher rating.\n`;
  table += '\nWant to add a third product to the comparison, or proceed with either one?';

  return table;
}

function buildSpecExplainResponse(text) {
  const t = text.toLowerCase();
  // Try to find a spec keyword mentioned
  const specKeys = Object.keys(SPEC_EXPLAIN);
  let found = null;
  for (const k of specKeys) {
    if (t.includes(k.toLowerCase())) { found = k; break; }
  }

  if (found) {
    return `**${found}**\n\n${SPEC_EXPLAIN[found]}\n\nWould you like me to compare this spec across any two products?`;
  }

  // General spec request — explain a random spec concept
  const allSpecs = [
    ['OLED', 'Organic Light-Emitting Diode. Each pixel lights itself, so blacks are pure black and colors are incredibly vibrant. Found in premium phones and laptops. Uses more power for dark themes, less for bright ones.'],
    ['Refresh Rate', 'How many times per second the display updates. 60Hz is standard; 120Hz+ feels noticeably smoother for scrolling and gaming. Higher rates use more battery.'],
    ['RAM', 'Temporary memory for running apps. 8GB = fine for web browsing and office work. 16GB+ recommended for creative work, gaming, or running many apps. Unlike storage, more RAM doesn\'t store files.'],
    ['SSD', 'Solid State Drive — flash-based storage that is much faster than old hard drives. An SSD makes your device boot in seconds and apps open instantly. Always prefer SSD over HDD.'],
    ['USB-C', 'A reversible connector standard. USB-C can carry power, data, and video through one port. Look for USB-C with Power Delivery (PD) for fast charging.'],
  ];

  const [label, explanation] = allSpecs[Math.floor(Math.random() * allSpecs.length)];
  return `**${label}** — ${explanation}`;
}

function buildCrossSellResponse(text) {
  const t = text.toLowerCase();
  // Find what product the user is looking at / just mentioned
  const found = products.find((p) => t.includes(p.name.toLowerCase().split(' ')[0]));
  if (!found) {
    return `Cross-sells work best when I know what you're ordering! Tell me what you're buying and I'll suggest the perfect additions.`;
  }

  // Suggest complementary products
  const crossMap = {
    phones: { label: 'Goes great with', picks: ['AirPods Pro 2', 'Sony WH-1000XM5', 'Anker 737 Power Bank'] },
    laptops: { label: 'Pair with', picks: ['Logitech MX Master 3S', 'Sony WH-1000XM5', 'Anker 737 Power Bank'] },
    accessories: { label: 'Popular add-ons', picks: ['Anker 737 Power Bank', 'Logitech MX Master 3S'] },
  };

  const cfg = crossMap[found.category];
  const picks = cfg.picks.map((name) => products.find((p) => p.name === name)).filter(Boolean);

  return `**${found.name}** — great pick! 👏\n\n**${cfg.label}:**\n\n${formatProductList(picks)}\n\nAdd any of these to your cart and I'll make sure it ships together.`;
}

function buildSalesAssistanceResponse(text) {
  const t = text.toLowerCase();

  if (/\b(warranty|guarantee)\b/.test(t))
    return `All TechZone products come with a **1-year manufacturer warranty** plus a **30-day hassle-free return policy**. If anything goes wrong, email us at support@techzone.app and we'll sort it out.`;

  if (/\b(shipping|delivery|deliver)\b/.test(t))
    return `We offer **free shipping on all orders over $50**. Orders placed before 2pm ship same business day. Standard delivery takes 3–5 business days; expedited options are available at checkout.`;

  if (/\b(return|refund|send back)\b/.test(t))
    return `Not happy? No problem. Our **30-day return policy** means you can send anything back, no questions asked — we'll even cover return shipping for orders over $50. Just email support@techzone.app with your order number.`;

  if (/\b(order|track|where is|status)\b/.test(t))
    return `You can track your order anytime from your account page. Enter your order number in the search bar, or email support@techzone.app and we'll give you a real-time update.`;

  if (/\b(payment|pay|card|installment)\b/.test(t))
    return `We accept all major credit cards, PayPal, Apple Pay, and Google Pay. For orders over $500, we also offer **3-month installment plans** with no interest — just select it at checkout.`;

  if (/\b(in stock|available|available now)\b/.test(t)) {
    return `Great news — everything in our catalog is currently in stock and available for immediate dispatch. Our most popular items (iPhone 15 Pro Max, MacBook Pro, Sony WH-1000XM5) are flying off the shelves, so if you're interested I'd recommend not waiting too long!`;
  }

  if (/\b(contact|help|support|speak|human|real person)\b/.test(t))
    return `The fastest way to reach us is **email: support@techzone.app** — we reply within 24 hours. You can also call us at **+1 (555) 123-4567** Mon–Fri 9am–6pm PST. Or use the contact form on our Contact page!`;

  return null;
}

// ─── Main Entry Point ────────────────────────────────────────────────────────
export function getMockAIResponse(userMessage) {
  const intent = classifyIntent(userMessage);

  switch (intent) {
    case INTENT.BUDGET:
      return buildBudgetResponse(null, userMessage);

    case INTENT.USE_CASE: {
      const useResult = buildUseCaseResponse(userMessage);
      return useResult ?? `Tell me more about what you're looking for! I can help with gaming, programming, video editing, photography, music, student needs, fitness tracking, and more.`;
    }
    case INTENT.COMPARE: {
      const compResult = buildComparisonResponse(userMessage);
      return compResult ?? `I can compare any two products in our catalog. Just say something like "Compare iPhone 15 Pro Max vs Samsung S24 Ultra" or "Which is better for gaming?"`;
    }
    case INTENT.SPEC:
      return buildSpecExplainResponse(userMessage);

    case INTENT.CROSS_SELL:
      return buildCrossSellResponse(userMessage);

    case INTENT.SALES: {
      const salesResult = buildSalesAssistanceResponse(userMessage);
      return salesResult ?? `I'm here to help! I can answer questions about orders, shipping, returns, warranties, payment options, and anything else you need.`;
    }

    default: {
      const t = userMessage.toLowerCase();
      // Check for specific product mentions
      const found = products.find((p) =>
        t.includes(p.name.toLowerCase().split(' ')[0])
      );
      if (found) {
        return `**${found.name}** is one of our best sellers!\n\n💰 **$${found.price}**${found.originalPrice ? ` (was $${found.originalPrice})` : ''}\n⭐ ${found.rating}/5 — ${found.reviews.toLocaleString()} reviews\n\n${found.description}\n\nWould you like to see the full specs, add it to your cart, or compare it with something else?`;
      }
      return [
        "I'm your TechZone assistant! I can help you find the perfect product, compare options, explain specs, and answer any questions about orders and shipping. What are you looking for today?",
        "Got a product in mind, or just browsing? Tell me what you need — budget, use case, or anything else — and I'll point you in the right direction.",
        "Happy to help! I know all 12 products in our catalog — phones, laptops, and accessories. Ask me anything!",
      ][Math.floor(Math.random() * 3)];
    }
  }
}
