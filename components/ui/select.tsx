'use client'

export function Select({ children, ...props }: any) {
  return <select {...props}>{children}</select>
}

export function SelectTrigger({ children, ...props }: any) {
  return <button {...props}>{children}</button>
}

export function SelectValue({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function SelectContent({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function SelectItem({ children, ...props }: any) {
  return <option {...props}>{children}</option>
}
