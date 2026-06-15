import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { YouTube } from '@/components/youtube';
import { withBasePath } from '@/lib/seo';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        alt={typeof props.alt === 'string' ? props.alt : ''}
        src={typeof props.src === 'string' ? withBasePath(props.src) : props.src}
      />
    ),
    YouTube,
    ...components,
  };
}
