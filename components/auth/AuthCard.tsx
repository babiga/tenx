import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCard({ className, children, ...props }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/80 backdrop-blur-md border border-white/10 p-8 md:p-10 shadow-2xl shadow-black/20 transition-colors hover:border-primary/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AuthCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCardHeader({
  className,
  children,
  ...props
}: AuthCardHeaderProps) {
  return (
    <div className={cn("text-center mb-8", className)} {...props}>
      {children}
    </div>
  );
}

interface AuthCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function AuthCardTitle({
  className,
  children,
  ...props
}: AuthCardTitleProps) {
  return (
    <h1
      className={cn("text-3xl md:text-4xl font-serif text-foreground mb-2", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

interface AuthCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function AuthCardDescription({
  className,
  children,
  ...props
}: AuthCardDescriptionProps) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      {children}
    </p>
  );
}

interface AuthCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCardContent({
  className,
  children,
  ...props
}: AuthCardContentProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {children}
    </div>
  );
}

interface AuthCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCardFooter({
  className,
  children,
  ...props
}: AuthCardFooterProps) {
  return (
    <div
      className={cn("mt-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
}
