import portrait from "../../assets/portrait.png"
import useDarkMode from "../../hooks/common/useDarkMode";

interface IPortraitProps {
  className: string;
}


const Portrait = ({ className }: IPortraitProps) => {
  const { isDark, } = useDarkMode();

  const lightFilter = `
    brightness(0) saturate(100%) invert(14%)
    sepia(18%) saturate(1157%) hue-rotate(15deg)
    brightness(95%) contrast(90%)
  `

  const darkFilter = `
    brightness(0) saturate(100%) invert(97%)
    sepia(8%) saturate(293%) hue-rotate(18deg)
    brightness(102%) contrast(96%)
  `

  return (
    <img 
      src={portrait}
      className={className}
      style={{ filter: isDark ? darkFilter : lightFilter }}
    />
  );
};

export default Portrait;
