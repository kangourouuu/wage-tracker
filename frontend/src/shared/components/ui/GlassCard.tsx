import type { FC, HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const GlassCard: FC<GlassCardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`glass-card ${className}`} {...props}>
      {children}
    </div>
  );
};
