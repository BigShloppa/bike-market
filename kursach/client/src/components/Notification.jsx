export default function Notification({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}