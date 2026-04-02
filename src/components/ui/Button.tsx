type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
}

export default function Button({ children, onClick, type = "button" }: ButtonProps) {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  )
}
