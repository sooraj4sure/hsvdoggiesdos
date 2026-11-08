import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * The ONE button in the app. Every button — patient site and admin —
 * renders through here, so all buttons are identical: 48px tall on
 * desktop, 52px on mobile, same padding, same radius, same weight.
 * Variants differ ONLY in colour, never in size.
 */
type Variant = "primary" | "accent" | "outline" | "ghost";

const styles: Record<Variant, string> = {
  primary: "btn",
  accent: "btn-accent",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  return (
    <button className={`${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", href, className = "", children, ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} className={`${styles[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
