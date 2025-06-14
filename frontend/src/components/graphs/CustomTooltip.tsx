import { ITooltipData } from "../../types";

interface CustomTooltipProps {
  data: ITooltipData;
  className?: string;
}


const CustomTooltip = ({
  data,
  className = "",
}: CustomTooltipProps) => {
  if (!data.active) {
    return undefined;
  }

  return (
    <div className={`
      flex flex-col p-1 rounded-lg border 
      shadow-lg font-im-fell text-xl
      min-w-fit whitespace-nowrap
      bg-parchment border-royal-wine 
      dark:bg-warm-taupe dark:border-crimson
      ${className}
    `}>
      <p>{`${data.label}`}</p>
      <p>{`Frequency: ${data.value}`}</p>
    </div>
  );
};

export default CustomTooltip;
