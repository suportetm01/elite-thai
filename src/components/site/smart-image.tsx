import NextImage, { type ImageProps } from "next/image";

/**
 * next/image do site estático: as imagens já vão otimizadas em `public/` (WebP), então
 * são servidas como estão (`images.unoptimized` no next.config).
 */
export default function Image(props: ImageProps) {
  return <NextImage {...props} />;
}
