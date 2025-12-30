type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  width?: string;
  height?: string;
};

export default function Input({
  placeholder = "",
  value = "",
  onChange,
  type = "text",
  width = "w-[398px]",
  height = "h-[36px]",
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value} // React state connected
      onChange={onChange} // must pass function from parent
      className={`${width} ${height} rounded-[6px] border border-[#E6E2D8] px-[12px] py-[4px] text-[16px] text-[#333333] placeholder:text-[#7A7A7A] outline-none focus:ring-2 focus:ring-[#0B5D1E]`}
    />
  );
}
