'use client'
import { useFormStatus } from 'react-dom'
import { Icons } from '../icons'

interface ButtonProps {
    children: string
}
 
export default function ClientButton({ children }: ButtonProps) {
  const status = useFormStatus()
  return (
    <button type="submit">{status.pending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/> : children}</button>
  )
}