import type {
  Animated,
  LayoutRectangle,
  NativeMethods,
  ViewStyle,
} from "react-native";
import type { styles } from "./components/style";

export type WalktroughedComponent = NativeMethods & React.ComponentType<any>;

export interface Step {
  name: string;
  order: number;
  visible: boolean;
  wrapperRef: React.RefObject<NativeMethods>;
  measure: () => Promise<LayoutRectangle>;
  text: string;
  style?: ViewStyle;
  arrowStyle?: ViewStyle;
  horizontalPosition?: "left" | "right" | "auto";
  verticalPosition?: "top" | "bottom" | "auto";
  backdropBorderRadius: number;
  arrowPosition: "left" | "center" | "right";
}

export interface CopilotContext {
  registerStep: (step: Step) => void;
  unregisterStep: (name: string) => void;
  getCurrentStep: () => Step | undefined;
}

export interface ValueXY {
  x: number;
  y: number;
}

export type SvgMaskPathFunction = (args: {
  size: Animated.ValueXY;
  position: Animated.ValueXY;
  canvasSize: ValueXY;
  radius: Animated.Value;
  step?: Step;
}) => string;

export type StepsMap = Record<string, Step>;

export type EasingFunction = (value: number) => number;

export type Labels = Partial<
  Record<"skip" | "previous" | "next" | "finish", string>
>;

export interface TooltipProps {
  labels: Labels;
}

export interface MaskProps {
  size: ValueXY;
  position: ValueXY;
  style: ViewStyle;
  easing?: EasingFunction;
  animationDuration: number;
  animated: boolean;
  backdropColor: string;
  svgMaskPath?: SvgMaskPathFunction;
  layout: {
    width: number;
    height: number;
  };
  onClick?: () => any;
  currentStep: Step;
  radius: number;
}

interface TooltipAnimationValues {
  delay: number;
  duration: number;
  easing: EasingFunction;
}

export interface CopilotOptions {
  easing?: ((value: number) => number) | undefined;
  overlay?: "svg" | "view";
  animationDuration?: number;
  tooltipComponent?: React.ComponentType<TooltipProps>;
  tooltipStyle?: ViewStyle;
  stepNumberComponent?: React.ComponentType<any>;
  animated?: boolean;
  labels?: Labels;
  androidStatusBarVisible?: boolean;
  svgMaskPath?: SvgMaskPathFunction;
  verticalOffset?: number;
  arrowColor?: string;
  arrowSize?: number;
  margin?: number;
  stopOnOutsideClick?: boolean;
  backdropColor?: string;
  style?: { [K in keyof typeof styles]?: Partial<ViewStyle> };
  horizontalPosition?: Step["horizontalPosition"];
  tooltipAnimationValues?: {
    fadeIn: TooltipAnimationValues;
    fadeOut: TooltipAnimationValues;
  };
  delayBetweenSteps?: number;
  onStepChangeEvent?: () => void;
}
