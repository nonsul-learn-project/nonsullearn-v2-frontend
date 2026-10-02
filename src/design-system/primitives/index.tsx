import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container ${className}`.trim()}>{children}</div>;
}
export function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={className}>{children}</section>;
}
export function Button(props: ComponentPropsWithoutRef<'button'>) {
  return <button {...props} className={`btn ${props.className ?? ''}`.trim()} />;
}
export function Link(props: ComponentPropsWithoutRef<'a'>) {
  return <a {...props} className={`text-decoration-none ${props.className ?? ''}`.trim()} />;
}
export function Heading({
  as: Tag = 'h2',
  ...props
}: {
  as?: Extract<ElementType, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
} & ComponentPropsWithoutRef<'h2'>) {
  return <Tag {...props} />;
}
export function Text(props: ComponentPropsWithoutRef<'p'>) {
  return <p {...props} />;
}
