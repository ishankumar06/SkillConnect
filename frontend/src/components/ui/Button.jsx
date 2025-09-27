export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-500 transition ${className}`}
    >
      {children}
    </button>
  );
}










