import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import { ITooltipData, INodeEvent } from "../types/tooltip";

export const adaptRechartsTooltip = (
  { active, payload, label }: TooltipProps<ValueType, NameType>
): ITooltipData => {
  return {
    label: `${label}`,
    value: payload?.[0]?.value as string | number ?? 0,
    active: active,
  };
};

export const adaptNivoTooltip = (
  { id, value }: INodeEvent
): ITooltipData => {
  return {
    label: id,
    value: value,
    active: true,
  };
};
