export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-[#403d41] shadow-md rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
