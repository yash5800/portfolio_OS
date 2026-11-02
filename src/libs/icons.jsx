import { icons } from "./iconMap";

export const Icon = ({ name, size, ...props }) => {
  const Component = icons[name] || icons.info;
  return <Component size={size} {...props} />;
};
