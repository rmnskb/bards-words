import portrait from "../../assets/portrait.png"
import useDarkMode from "../../hooks/common/useDarkMode";

interface IPortraitProps {
  className: string;
}


const Portrait = ({ className }: IPortraitProps) => {
  const isDarkMode = useDarkMode();

  const darkFilter = `
    brightness(0) saturate(100%) invert(14%)
    sepia(18%) saturate(1157%) hue-rotate(15deg)
    brightness(95%) contrast(90%)
  `

  const lightFilter = `
    brightness(0) saturate(100%) invert(93%)
    sepia(16%) saturate(347%) hue-rotate(6deg)
    brightness(98%) contrast(94%)
  `

  return (
    <img
      src={portrait}
      className={className}
      style={{ filter: isDarkMode ? lightFilter : darkFilter }}
    />
  );
};

export default Portrait;
