'use client'

export function Table({ children, ...props }: any) {
  return <table {...props}>{children}</table>
}

export function TableHead({ children, ...props }: any) {
  return <thead {...props}>{children}</thead>
}

export function TableBody({ children, ...props }: any) {
  return <tbody {...props}>{children}</tbody>
}

export function TableRow({ children, ...props }: any) {
  return <tr {...props}>{children}</tr>
}

export function TableHeader({ children, ...props }: any) {
  return <th {...props}>{children}</th>
}

export function TableCell({ children, ...props }: any) {
  return <td {...props}>{children}</td>
}
