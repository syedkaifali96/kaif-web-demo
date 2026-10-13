# Forma Studio — Kaif Web Demo

A responsive four-page portfolio concept by Syed Kaif Ali, built with AI-assisted HTML, CSS and JavaScript. Forma Studio and its displayed concepts are fictional, personal portfolio work, not commissioned client projects.

**Live website:** https://syedkaifali96.github.io/kaif-web-demo/

## Pages and interactions

- Home, About, Services and Contact.
- Responsive navigation, project filters and project preview dialogs.
- Service FAQs and service selection passed to the contact page.
- Contact validation, inquiry preview, editing and downloadable inquiry copy.
- Original SVG artwork, keyboard focus styles and reduced-motion support.

## Run and edit

The website has no package dependencies or build requirement. Open `index.html`, or serve this folder with any static HTTP server. Edit `styles.css`, `app.js` and the SVG assets directly. Page templates are in `build-demo.mjs`; run `node build-demo.mjs` to regenerate the four HTML pages. Template regeneration overwrites those HTML files.

GitHub Pages publishes `main` from the repository root. `.nojekyll` disables Jekyll processing. Navigation and assets use relative URLs so the website works under `/kaif-web-demo/`.

## Contact form

The first submit creates an on-device inquiry preview. Only **Send inquiry** posts the visitor's details to [FormSubmit](https://formsubmit.co/) for email delivery to the portfolio owner. Default CAPTCHA protection is enabled. The recipient confirmed activation; mailbox receipt has not been independently verified.

The static fallback return URL is configured for this GitHub Pages website. JavaScript calculates the return page relative to the current page, preserving a project-folder path. To change the recipient, edit the form action in `build-demo.mjs` and regenerate. Do not put passwords, mail credentials or API secrets into public static files.

This repository contains the public website and its page generator, without ChatGPT hosting configuration, tokens, private source history or account data. It does not require ChatGPT sign-in.
