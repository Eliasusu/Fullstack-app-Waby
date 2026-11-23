/**
 * Ancho de las cajas de contenido (BoxContainer), mobile-first (notas 70 y 75):
 * - base (desde 360 px): todo el ancho menos 12 px de margen por lado, sin scroll horizontal;
 * - SM y MD: hasta 672 px, centrada;
 * - LG: hasta 896 px, para aprovechar la pantalla.
 */
export const boxWidth = "w-[calc(100%-1.5rem)] max-w-2xl lg:max-w-4xl";

/** Cajas que en LG van en la grilla de 2 columnas del Home: ocupan su celda entera. */
export const gridBoxWidth = `${boxWidth} lg:w-full lg:max-w-none`;
