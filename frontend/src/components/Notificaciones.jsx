export default function Popup({ message }) {
  if (!message) return null
  return (
    <div className="popup">
      {message}
    </div>
  )
}