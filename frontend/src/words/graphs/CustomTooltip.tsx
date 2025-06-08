import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip
  = ({active, payload, label}: TooltipProps<ValueType, NameType>) => {
  if (!active) {
    return undefined;
  }

  return (
    <div className="
      block p-1 rounded-lg border shadow-lg font-im-fell text-xl
      bg-parchment border-deep-wine dark:bg-aged-leather dark:border-crimson
    ">
      <p>{`${label}`}</p>
      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
      <p>{`Frequency: ${payload?.[0].value}`}</p>
    </div>
  );
};

export default CustomTooltip;
