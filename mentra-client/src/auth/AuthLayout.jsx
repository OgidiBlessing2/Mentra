export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-8">
      {children}
    </div>
  );
}