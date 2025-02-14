export default function NumberInput({ value, onChange, onIncrement, onDecrement }) {
  return (
    <div className="flex items-center border border-blue-500 rounded-lg p-1 focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-2 text-center text-lg focus:outline-none"
      />
      
    </div>
  );
}
