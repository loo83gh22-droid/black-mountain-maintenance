// =============================================
// BUILD: turns src/ + site.config.js into the static pages Vercel serves.
// Run `node build.js` after editing anything in src/ or site.config.js,
// then commit the regenerated .html files. No dependencies.
//
// Template syntax (deliberately tiny):
//   {{key.path}}      escaped value from the context (unknown keys fail the build)
//   {{{key.path}}}    raw HTML value
//   {{> name}}        include src/partials/name.html
//   {{#if key}}...{{else}}...{{/if}}   blocks may nest
// =============================================

const fs = require('fs');
const path = require('path');
const config = require('./site.config.js');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');

const PAGES = [
  {
    src: 'home.html', out: 'index.html', route: '/',
    title: 'Grounds Maintenance Kelowna | Black Mountain Maintenance',
    description: 'Owner-led grounds maintenance for Kelowna strata communities and homeowners. Quiet battery-powered equipment and one point of contact. Request a quote.',
  },
  {
    src: 'strata.html', out: 'strata-property-managers.html', route: '/strata-property-managers', nav: 'Strata & Property Managers',
    title: 'Strata Landscaping & Grounds Maintenance Kelowna | Black Mountain Maintenance',
    description: 'Seasonal and multi-year grounds maintenance for Kelowna stratas and property managers. Photo updates, a direct line to the owner, quiet equipment.',
  },
  {
    src: 'residential.html', out: 'residential.html', route: '/residential', nav: 'Residential',
    title: 'Lawn Care & Fall Clean-Ups Kelowna | Black Mountain Maintenance',
    description: 'Weekly lawn care, spring and fall clean-ups, shrub cutbacks, bed refreshes and exterior cleaning for Kelowna homes. Free quotes from the owner.',
  },
  {
    src: 'about.html', out: 'about.html', route: '/about', nav: 'About',
    title: 'About Black Mountain Maintenance | Kelowna',
    description: 'Black Mountain Maintenance is an owner-led Kelowna grounds maintenance company, built on years of commercial grounds and account management experience.',
  },
  {
    src: 'service-area.html', out: 'service-area.html', route: '/service-area', nav: 'Service Area',
    title: 'Service Area | Black Mountain Maintenance, Kelowna',
    description: 'Black Mountain Maintenance serves Black Mountain, Kirschner Mountain, Kettle Valley, Rutland, Glenmore and Joe Rich in Kelowna, BC.',
  },
  {
    src: 'contact.html', out: 'contact.html', route: '/contact', nav: 'Request a Quote',
    title: 'Request a Quote | Black Mountain Maintenance',
    description: 'Request a free grounds maintenance quote for your Kelowna strata, commercial property or home. We reply within one business day.',
  },
  {
    // Landing page for review requests (QR code, text message). Not in the nav
    // or sitemap, and kept out of search results.
    src: 'review.html', out: 'review.html', route: '/review', hidden: true, robots: 'noindex, follow',
    title: 'Leave a Review | Black Mountain Maintenance',
    description: 'Thanks for choosing Black Mountain Maintenance. Leave a quick review on Google or Facebook.',
  },
];

const NAV = PAGES.filter(p => p.nav);

// ---------- template engine ----------

const escapeHtml = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function lookup(ctx, key, file) {
  const value = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx);
  if (value === undefined) throw new Error(`Unknown template key "${key}" in ${file}`);
  return value;
}

const truthy = v => Array.isArray(v) ? v.length > 0 : Boolean(v);

function render(tpl, ctx, file) {
  for (let i = 0; i < 10 && /\{\{>\s*[\w-]+\s*\}\}/.test(tpl); i++) {
    tpl = tpl.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) =>
      fs.readFileSync(path.join(SRC, 'partials', name + '.html'), 'utf8'));
  }
  // Resolve innermost blocks first so ifs can nest.
  const innermostIf = /\{\{#if ([\w.]+)\}\}((?:(?!\{\{#if )[\s\S])*?)\{\{\/if\}\}/g;
  for (let prev = null; prev !== tpl;) {
    prev = tpl;
    tpl = tpl.replace(innermostIf, (_, key, inner) => {
      const [yes, no = ''] = inner.split('{{else}}');
      return truthy(lookup(ctx, key, file)) ? yes : no;
    });
  }
  tpl = tpl.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, key) => String(lookup(ctx, key, file)));
  tpl = tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => escapeHtml(lookup(ctx, key, file)));
  const leftover = tpl.match(/\{\{[^}]*\}\}/);
  if (leftover) throw new Error(`Unrendered template tag ${leftover[0]} in ${file}`);
  return tpl;
}

// ---------- computed blocks ----------

const listText = items => items.length < 2 ? items.join('')
  : items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];

const reviews = JSON.parse(fs.readFileSync(path.join(SRC, 'data', 'reviews.json'), 'utf8'));
const reviewsHtml = reviews.map(r => `
        <div class="testimonial-card reveal">
          <div class="testimonial-stars" aria-label="5 stars">★★★★★</div>
          <blockquote class="testimonial-quote">"${escapeHtml(r.quote)}"</blockquote>
          <div class="testimonial-author">
            <span class="testimonial-name">${escapeHtml(r.name)}</span>
            <span class="testimonial-location">${escapeHtml(r.location)}${r.source ? ' &middot; ' + escapeHtml(r.source) : ''}</span>
          </div>
        </div>`).join('\n');

const c = config.credentials;
const credentialLines = [
  c.bcRegistered && 'Registered BC business',
  c.insured && (c.insuranceDetails ? `Insured: ${c.insuranceDetails}` : 'Fully insured'),
  c.workSafeBC && 'Registered with WorkSafeBC',
  c.businessLicence && 'City of Kelowna business licence',
].filter(Boolean);
const credentialsItems = credentialLines
  .map(t => `<li><span class="check">✓</span> ${escapeHtml(t)}</li>`).join('\n          ');

const serviceAreasItems = config.serviceAreas
  .map(a => `<li>${escapeHtml(a)}</li>`).join('\n          ');

function navHtml(page, mobile) {
  return NAV.map(p => {
    const isCta = p.route === '/contact';
    const cls = isCta ? (mobile ? 'mobile-nav-cta' : 'nav-cta') : (p.route === page.route ? 'active' : '');
    const current = p.route === page.route ? ' aria-current="page"' : '';
    return `<a href="${p.route}"${cls ? ` class="${cls}"` : ''}${current}>${escapeHtml(p.nav)}</a>`;
  }).join('\n      ');
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: config.businessName,
  url: config.siteUrl + '/',
  image: config.siteUrl + '/og-image.jpg',
  logo: config.siteUrl + '/logo-mountain.png',
  telephone: '+1-' + config.phone,
  email: config.email,
  founder: config.ownerName,
  description: 'Owner-led grounds maintenance for strata communities, commercial properties and homes in Kelowna, BC, using quiet battery-powered equipment.',
  address: { '@type': 'PostalAddress', addressLocality: 'Kelowna', addressRegion: 'BC', addressCountry: 'CA' },
  areaServed: config.serviceAreas.map(a => ({ '@type': 'Place', name: `${a}, Kelowna, BC` })),
  sameAs: [config.facebookUrl].filter(Boolean),
};

// ---------- build ----------

const layout = fs.readFileSync(path.join(SRC, 'layout.html'), 'utf8');
const base = {
  ...config,
  phoneHref: 'tel:' + config.phone.replace(/\D/g, ''),
  year: new Date().getFullYear(),
  serviceAreasText: listText(config.serviceAreas),
  serviceAreasItems,
  reviewsHtml,
  hasReviews: reviews.length > 0,
  credentialsItems,
  hasCredentials: credentialLines.length > 0,
  schemaJson: JSON.stringify(schema, null, 2).replace(/</g, '\\u003c'),
};

for (const page of PAGES) {
  const ctx = {
    ...base,
    page: { robots: 'index, follow', ...page, canonical: config.siteUrl + (page.route === '/' ? '/' : page.route) },
    navLinks: navHtml(page, false),
    mobileNavLinks: navHtml(page, true),
  };
  const body = render(fs.readFileSync(path.join(SRC, 'pages', page.src), 'utf8'), ctx, page.src);
  const html = render(layout, { ...ctx, body }, 'layout.html')
    .replace('<!DOCTYPE html>', `<!DOCTYPE html>\n<!-- Generated by build.js from src/pages/${page.src}. Edit the source, not this file. -->`);
  fs.writeFileSync(path.join(ROOT, page.out), html);
  console.log('built', page.out);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  PAGES.filter(p => !p.hidden).map(p => `  <url><loc>${config.siteUrl}${p.route === '/' ? '/' : p.route}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  '\n</urlset>\n');
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
console.log('built sitemap.xml, robots.txt');
