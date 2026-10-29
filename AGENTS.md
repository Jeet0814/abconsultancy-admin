<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared navigation and footer in `SiteLayout`, and business service copy in `site-content` so all public pages stay consistent.
- Contact form delivers enquiries via a prefilled WhatsApp link (wa.me); testimonials are stored and shown only when approved=true.
- Compliance due dates, checklists and FAQs live in `src/lib/site-content.ts` so the owner's yearly updates touch one file.
