'use client'

export function AlertDialog({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function AlertDialogTrigger({ children, ...props }: any) {
  return <button {...props}>{children}</button>
}

export function AlertDialogContent({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function AlertDialogHeader({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function AlertDialogTitle({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function AlertDialogDescription({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function AlertDialogFooter({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function AlertDialogCancel({ children, ...props }: any) {
  return <button {...props}>{children}</button>
}

export function AlertDialogAction({ children, ...props }: any) {
  return <button {...props}>{children}</button>
}
