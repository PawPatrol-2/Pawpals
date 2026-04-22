export default function ExploreSearchBar({ value, onChange }: { value: string; onChange: (newValue: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}