'use client'

export function Avatar({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function AvatarFallback({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}
