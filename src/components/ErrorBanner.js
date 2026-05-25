export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-800"
      role="alert"
    >
      {message}
    </div>
  );
}
