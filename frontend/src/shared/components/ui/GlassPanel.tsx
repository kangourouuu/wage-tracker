import type { FC, HTMLAttributes, ReactNode } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const GlassPanel: FC<GlassPanelProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`glass-panel ${className}`} {...props}>
      {children}
    </div>
  );
};
