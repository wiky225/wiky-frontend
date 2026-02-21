export default function PhoneInput({ name, value, onChange, required = false, className = '' }) {
  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange({ target: { name, value: digits } });
  };

  const format = (digits = '') =>
    digits.replace(/(\d{2})(?=\d)/g, '$1 ');

  return (
    <div className={`flex border rounded overflow-hidden focus-within:ring-2 focus-within:ring-wikya-blue ${className}`}>
      <span className="bg-gray-100 border-r px-3 py-2 text-gray-500 font-semibold text-sm whitespace-nowrap select-none">
        +225
      </span>
      <input
        type="tel"
        value={format(value)}
        onChange={handleChange}
        required={required}
        placeholder="07 XX XX XX XX"
        className="flex-1 px-3 py-2 outline-none"
      />
    </div>
  );
}
