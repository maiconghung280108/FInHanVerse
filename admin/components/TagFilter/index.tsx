import IconClose from "@components/Icon/IconClose";

interface ITagFilterProps {
  onClick: () => void;
  label?: string;
  value?: string;
}

export default function TagFilter({onClick, label, value}: ITagFilterProps) {
  return (
    <div className="flex gap-2 border border-dashed px-2 py-1 rounded-lg items-center">
      <div className="font-semibold text-sm">{label} : </div>
      <div className="bg-[#919EAB29] items-center justify-center flex text-xs rounded-md px-2 py-1 gap-1">
        {value}
        <button type="button" onClick={onClick}>
          <IconClose />
        </button>
      </div>
    </div>
  );
}
