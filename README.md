# Victory Echi — Marketing & Brand Communications Strategist

A responsive personal portfolio website for **Victory Echi**, a Marketing & Brand Communications Strategist.

The website is designed to communicate Victory's positioning, showcase selected projects, publish written insights, highlight professional skills and education, and provide a clear way for prospective clients to get in touch.

---

## Overview

This portfolio uses a bold editorial visual style built around:

* Deep purple and lavender brand colours
* Large expressive typography
* High-contrast cards
* Responsive layouts
* Clear calls to action
* Case-study presentation
* Blog/article publishing
* Lightweight client-side navigation

The site is intentionally built with **plain HTML, CSS, and JavaScript**, making it simple to edit, host, and maintain without a framework or build system.

---

## Features

### Hero Section

The homepage opens with:

* Name and professional title
* Clear positioning statement
* Short introduction
* Primary call-to-action
* Secondary contact call-to-action
* Interactive "Before / After" messaging demonstration

The messaging animation demonstrates the site's central value proposition: turning unclear marketing language into clearer customer-focused messaging.

---

### About Section

The About section contains:

* Professional introduction
* Approach to marketing and communication
* Positioning philosophy
* Supporting quotation
* Personal monogram/portrait area

The portrait area currently uses a text-based `VE` placeholder and can be replaced with a professional photograph.

---

### Projects

The Projects section presents selected portfolio work.

Each project includes:

* Project title
* Client/project type
* Category
* Summary
* Challenge
* Approach
* Outcome
* Relevant skills/tags

Projects can be filtered by category.

Available categories currently include:

* Strategy
* Messaging
* Copywriting
* Content

Projects also have individual detail pages using hash-based navigation.

Example:

```text
#project/brand-positioning
```

---

### Blog

The Blog section supports publishing marketing and communication articles.

Each article includes:

* Title
* Publication date
* Content type
* Category
* Excerpt
* Full article content

Posts can be filtered by category.

Example article URL:

```text
#post/clarity-in-marketing
```

---

### Skills

Skills are organised into four groups:

1. Strategy
2. Communication
3. Content
4. Working Style

The structure makes it easy to add, remove, or reorganise skills from the JavaScript data object.

---

### Education

Education and professional development are displayed as a vertical timeline.

Each entry contains:

* Qualification or development area
* Time/status
* Description

---

### Contact

The contact section provides direct links for:

* Email
* LinkedIn
* Instagram

The contact information is controlled from the `DATA.contact` object in the JavaScript.

---

## Technology

This project uses:

### HTML5

Provides the semantic structure of the website.

### CSS3

The stylesheet includes:

* CSS custom properties
* CSS Grid
* Flexbox
* Responsive media queries
* CSS transitions
* Accessible focus states
* Reduced-motion support
* Responsive typography

### Vanilla JavaScript

JavaScript handles:

* Content rendering
* Project filtering
* Blog filtering
* Mobile navigation
* Page routing
* Project detail pages
* Blog detail pages
* Hero animation
* Dynamic page titles

No JavaScript framework is required.

---

## Project Structure

The current implementation can be used as a single HTML file:

```text
victory-echi/
│
└── index.html
```

If the project is later expanded, it can be organised as:

```text
victory-echi/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── images/
│   ├── portrait.jpg
│   ├── project-1.jpg
│   ├── project-2.jpg
│   └── project-3.jpg
│
└── README.md
```

---

## Customising the Website

Most of the website's editable content is contained inside the `DATA` object in the JavaScript.

The main structure is:

```javascript
const DATA = {
  hero: {},
  about: {},
  projects: [],
  posts: [],
  skills: [],
  education: [],
  contact: {}
};
```

This means content can be updated without changing the HTML structure.

---

## Changing the Hero Content

Find:

```javascript
hero: {
  name: "Victory Echi",
  title: "Marketing & Brand Communications Strategist",
  headline: "Marketing messages customers actually listen to.",
  intro: "...",
  cta1: "See the proof",
  cta2: "Work with me"
}
```

Update the values to change the hero section.

---

## Adding a Project

Add another object to:

```javascript
projects: []
```

For example:

```javascript
{
  id: "new-project",
  title: "New Project",
  client: "Client Name",
  category: "Strategy",
  featured: false,
  cover: "NP",
  summary: "Short project description.",
  challenge: "Describe the challenge.",
  solution: "Describe the approach.",
  result: "Describe the outcome.",
  tags: [
    "Strategy",
    "Messaging"
  ]
}
```

The project will automatically appear in the Projects section.

Its detail page will be:

```text
#project/new-project
```

---

## Adding a Blog Post

Add another object to:

```javascript
posts: []
```

Example:

```javascript
{
  id: "new-article",
  title: "Your Article Title",
  date: "October 2026",
  type: "Article",
  category: "Messaging",
  excerpt: "A short description of the article.",
  body: `
    <p>Your article begins here.</p>

    <h3>A section heading</h3>

    <p>More article content.</p>
  `
}
```

The article automatically appears in the Blog section.

Its detail page will be:

```text
#post/new-article
```

---

## Adding a Real Portrait

The current About section uses a monogram:

```html
<div class="mono">VE</div>
```

A professional portrait can replace this with:

```html
<img
  src="images/victory-echi.jpg"
  alt="Victory Echi"
>
```

The existing `.portrait img` CSS already provides the necessary sizing and styling.

---

## Updating Contact Information

Find:

```javascript
contact: {
  heading: "Let's talk",
  text: "...",
  links: [
    ...
  ]
}
```

Replace the placeholder email:

```text
victory@example.com
```

with the real professional email address.

Social links should also be replaced with Victory's actual profiles.

---

## Responsive Design

The website is designed to work across:

* Mobile phones
* Tablets
* Laptops
* Desktop monitors

Responsive breakpoints are already included in the CSS.

The navigation automatically changes from a desktop navigation bar to a mobile menu.

---

## Accessibility

The website includes several accessibility considerations:

* Semantic HTML elements
* Skip-to-content link
* Keyboard-accessible buttons
* Visible keyboard focus states
* ARIA labels
* `aria-expanded` for the mobile navigation
* `aria-pressed` for filters
* Reduced-motion support
* Descriptive image `alt` text where images are used

Users who have enabled reduced motion in their operating system will receive a less animated experience.

---

## Performance

The site intentionally avoids large JavaScript frameworks and unnecessary dependencies.

Current external dependencies are limited to Google Fonts:

* Bricolage Grotesque
* Hanken Grotesk

The site can therefore be hosted as a static website.

---

## Running Locally

No build process is required.

Simply open:

```text
index.html
```

in a modern web browser.

For a better development experience, use a local server.

For example, with VS Code, the **Live Server** extension can be used.

---

## Deployment

Because this is a static website, it can be deployed to services such as:

* GitHub Pages
* Netlify
* Vercel
* Cloudflare Pages
* Any standard web hosting provider

No server-side runtime is required for the current version.

---

## SEO

The document already contains:

```html
<title>
Victory Echi | Marketing & Brand Communications Strategist
</title>
```

and:

```html
<meta
  name="description"
  content="Victory Echi helps founders and coaches clarify their marketing message so customers will listen."
>
```

Before publishing, the description should be reviewed and adjusted to accurately reflect the final positioning.

Recommended future SEO improvements include:

* Open Graph metadata
* Twitter/X card metadata
* Canonical URL
* Structured data / Schema.org
* Sitemap
* Robots.txt
* Optimised image filenames
* Descriptive page-specific metadata

---

## Content Management

This version does not use a CMS.

Content is stored directly in JavaScript.

This is useful for a small portfolio because:

* There is no database
* There is no backend
* There are no CMS fees
* Hosting is inexpensive or potentially free
* The site remains lightweight

For frequent publishing, a headless CMS or static-site generator could be introduced later.

---

## Future Improvements

Possible future additions include:

### Portfolio

* Real project screenshots
* Client testimonials
* Measurable project results
* Project image galleries
* More detailed case studies

### Blog

* Search
* Tags
* Related articles
* Pagination
* RSS feed
* Markdown-based content

### Contact

* Real contact form
* Form validation
* Spam protection
* Email delivery service
* Booking/calendar integration

### Analytics

A privacy-conscious analytics solution can be added to understand:

* Page visits
* Most-read articles
* Project views
* CTA interactions
* Traffic sources

### SEO

Add:

* Open Graph images
* Structured data
* Sitemap
* Robots.txt
* Canonical URLs

---

## Important Before Launch

Before deploying the website publicly, replace all placeholder information.

### Required

* [ ] Replace `victory@example.com`
* [ ] Add real LinkedIn URL
* [ ] Add real Instagram URL
* [ ] Add professional portrait
* [ ] Replace sample project information with real case studies
* [ ] Verify all claims and project outcomes
* [ ] Proofread all website copy
* [ ] Test every navigation link
* [ ] Test the mobile menu
* [ ] Test the project filters
* [ ] Test the blog filters
* [ ] Test project detail pages
* [ ] Test article detail pages
* [ ] Test the contact links

### Recommended

* [ ] Add favicon/brand icon
* [ ] Add social sharing metadata
* [ ] Add a custom domain
* [ ] Add analytics if required
* [ ] Test accessibility
* [ ] Test performance
* [ ] Test across multiple browsers

---

## Browser Support

The website is intended for modern browsers, including:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

The implementation uses modern CSS and JavaScript features and should be tested in the target browsers before production deployment.

---

## License

Unless otherwise specified, the portfolio content, branding, writing, photography, case studies, and other original materials belong to **Victory Echi**.

The underlying website code can be adapted for the project owner's use.

---

## Credits

**Design & Development:** Victory Echi Portfolio

**Typography:**

* Bricolage Grotesque
* Hanken Grotesk

**Primary Technologies:**

* HTML5
* CSS3
* Vanilla JavaScript

---

## Status

**Development status:** Completed foundation / ready for content customisation

The current version provides the complete portfolio structure and client-side functionality. Before production launch, replace the sample content and placeholder contact details with verified information.
