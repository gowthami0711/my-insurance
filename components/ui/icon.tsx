import Image from "next/image";
import { memo } from "react";

type IconProps = {
  name: string;
  size?: number;
  className?: string;
  active?: boolean;
};

export const Icon = memo(function Icon({
  name,
  size = 20,
  className = "",
  active = false,
}: IconProps) {
  return (
    <Image
      src={`/images/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={`${active ? "brightness-0 invert" : "opacity-60"} ${className}`}
    />
  );
});

export default Icon; 