# QuadroFilms · Javier Vrana

Web one-page de QuadroFilms, productora audiovisual de Mendoza. Hecha por [GenLab](https://genlab.com.ar).

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # genera dist/
npm run lint
```

## Publicación

Cada merge a `main` publica la web en Cloudflare (`npm run build`, sirve `dist/` según `wrangler.jsonc`).
Los cambios entran por pull request desde una rama.

## Dónde está cada cosa

- `src/config/site.ts`: WhatsApp (número y mensaje predefinido), email y redes.
- `src/data/works.ts`: fotos de la galería con sus títulos. Las imágenes están en `public/works/` (800 y 1600 px).
- `src/components/Lens.tsx`: el lente interactivo del hero. Las piezas del isotipo están en `public/brand/iso/` y sus posiciones en `lensPieces.ts`.
- `src/components/gallery/`: esfera 3D (desktop), vista ampliada y modo de galería según el dispositivo.
