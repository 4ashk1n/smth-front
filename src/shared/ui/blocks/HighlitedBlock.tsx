import { Flex, type FlexProps } from "@mantine/core"
import type { CategoryColors } from "../../../entities/category/types/category.types";

const HighlitedBlock: React.FC<FlexProps & CategoryColors & { glow?: boolean; fill?: boolean, borderWidth?: number}> = ({
  lightColor,
  accentColor,
  darkColor,
  style,
  children,
  glow = true,
  fill = false,
  borderWidth = 2,
  ...rest
}) => {

  return (
    <Flex
      w={rest.w || "auto"}
      h={rest.h || "auto"}
      style={{
        transition: '400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
        position: "relative",
        borderRadius: 10,
        boxShadow: glow ? `0 0 30px ${lightColor}25, 0px 5px 10px #00000040` : "none",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <Flex
        style={{
          borderRadius: 10,
          width: "100%",
          background: fill ? `linear-gradient(0deg, #000000, ${accentColor})` :"rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(20px)",
        ...style,
        }}
        {...rest}
      >
        {children}
      </Flex>

      <span
        aria-hidden
        style={{
          zIndex: 11,
          position: "absolute",
          inset: 0,
          borderRadius: 10,
          padding: borderWidth,
          pointerEvents: "none",
          background: `linear-gradient(0deg, ${darkColor}, ${accentColor})`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </Flex>
  )
}

export default HighlitedBlock
