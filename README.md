# Syed Kaif Ali — Personal Web Portfolio

A four-page personal portfolio for a student web developer in Karachi, Pakistan. Built with AI-assisted HTML, CSS and JavaScript.

**Live website:** https://syedkaifali96.github.io/kaif-web-demo/

## Content

- Home, About, Services and Contact, with responsive navigation.
- UniNest Pakistan is labeled as an educational team project, without claiming sole authorship.
- CareSwitch is labeled as a personal student prototype, without clinical or emergency-use claims.
- Project artwork consists of original illustrative SVG previews, rather than actual application screenshots.
- Business contact links, GitHub and LinkedIn; no birth date or precise home address.
- Project filters and dialogs, service FAQs, form validation, inquiry preview, edit and download.

## Editing

No package dependencies. Run `node build-demo.mjs` to regenerate the four HTML pages from the templates; this overwrites the HTML files. Edit `styles.css`, `app.js` and SVG assets directly. Serve this folder with a static HTTP server for local testing.

GitHub Pages publishes `main` from the repository root. `.nojekyll` disables Jekyll processing. Relative navigation and asset URLs preserve the project-folder path.

## Contact form

Preview your inquiry creates an on-device summary. Only **Send inquiry** posts visitor details to [FormSubmit](https://formsubmit.co/) for email delivery to the owner. Default CAPTCHA protection is retained. Activation and receipt of a test inquiry from this GitHub Pages origin were confirmed in the recipient mailbox on 13 October 2026.

JavaScript sets the return page relative to the current contact page, preserving `/kaif-web-demo/`. The static fallback is also configured for the live website. To change the recipient, edit the form action in the page generator and regenerate. Never add mail passwords or API secrets to this public repository.

This static site is publicly accessible and does not require ChatGPT sign-in.
