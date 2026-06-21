"use client";

import type { ComponentProps } from "react";

type AppLinkProps = ComponentProps<"a"> & {
  prefetch?: boolean;
};

export default function AppLink({
  href = "#",
  ...props
}: AppLinkProps) {
  const { prefetch, ...anchorProps } = props;
  void prefetch;

  return <a href={href} {...anchorProps} />;
}
