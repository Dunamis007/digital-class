'use client'

export function DropdownMenu({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function DropdownMenuContent({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function DropdownMenuItem({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function DropdownMenuTrigger({ children, ...props }: any) {
  return <button {...props}>{children}</button>
}
