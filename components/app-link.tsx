"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

type AppLinkProps = ComponentProps<"a"> & {
  prefetch?: boolean;
};

export default function AppLink({
  href = "#",
  prefetch = false,
  ...props
}: AppLinkProps) {
  return <NextLink href={href} prefetch={prefetch} {...props} />;
}
