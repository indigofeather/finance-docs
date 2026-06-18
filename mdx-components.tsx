import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { StaticImageData } from 'next/image';
import { YouTube } from '@/components/youtube';
import { withBasePath } from '@/lib/seo';

function isStaticImageData(src: unknown): src is StaticImageData {
  return (
    typeof src === 'object' &&
    src !== null &&
    'src' in src &&
    typeof (src as { src?: unknown }).src === 'string'
  );
}

function resolveImageSrc(src: unknown): string | undefined {
  if (typeof src === 'string') return withBasePath(src);
  if (isStaticImageData(src)) return withBasePath(src.src);
  return undefined;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        alt={typeof props.alt === 'string' ? props.alt : ''}
        src={resolveImageSrc(props.src)}
        width={props.width ?? (isStaticImageData(props.src) ? props.src.width : undefined)}
        height={props.height ?? (isStaticImageData(props.src) ? props.src.height : undefined)}
      />
    ),
    YouTube,
    ...components,
  };
}
