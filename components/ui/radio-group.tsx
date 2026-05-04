'use client'

export function RadioGroup({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

export function RadioGroupItem({ ...props }: any) {
  return <input type="radio" {...props} />
}
