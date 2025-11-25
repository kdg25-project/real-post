interface SpacerProps {
  size?: "sm" | "lg";
}

export default function Spacer({ size = "sm" }: SpacerProps) {
  // Tailwindの高さを決める
  const height = size === "sm" ? "h-[134px]" : "h-[212px]";

  return <div className={height} />;
}
