# Quickstart: Lavender Background Styling

**Feature**: 015-lavender-background

## What this feature does

Adds a decorative lavender botanical illustration fixed to the left side of the viewport on all pages, over a seamlessly matching off-white background colour.

## How to verify the implementation

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Open the site** at the local dev URL.

3. **Visual checks** (desktop browser):
   - Background is a uniform warm off-white (not pure white).
   - Lavender illustration appears along the left edge of the viewport.
   - Illustration does NOT tile or repeat.
   - No visible colour seam between the illustration background and the page background.
   - Nav bar matches the off-white background.

4. **Scroll test**:
   - Scroll down through the page — the illustration stays fixed to the left edge; it does not move.

5. **Mobile check** (resize browser or use DevTools device emulation at 375 px width):
   - The lavender illustration is NOT visible (hidden below 640 px).
   - All text content is fully readable; no image overlapping.
   - Off-white background is still present.

6. **Image-load failure test**:
   - In DevTools → Network tab, block the `lavender.png` request and reload.
   - No broken-image icon visible; page still shows clean off-white background.

## Files changed by this feature

| File | Change |
|------|--------|
| `public/lavender.png` | New — the lavender illustration image file |
| `src/index.css` | Add `background-color` to `body` |
| `src/App.tsx` | Add fixed-position decorative image element |
| `src/components/Nav.tsx` | Update `bg-white` → off-white to match body |
