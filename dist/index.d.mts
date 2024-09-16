import { NativeMethods, LayoutRectangle, ViewStyle, Animated, ScrollView } from 'react-native';
import * as React$1 from 'react';
import React__default, { PropsWithChildren } from 'react';
import { Emitter } from 'mitt';

declare let styles: {
    container: {
        position: "absolute";
        left: number;
        top: number;
        right: number;
        bottom: number;
        zIndex: number;
    };
    arrow: {
        position: "absolute";
        borderColor: string;
        borderWidth: number;
    };
    tooltip: {
        position: "absolute";
        paddingTop: number;
        paddingHorizontal: number;
        backgroundColor: string;
        borderRadius: number;
        overflow: "hidden";
    };
    tooltipText: {};
    tooltipContainer: {
        flex: number;
    };
    stepNumberContainer: {
        position: "absolute";
        width: number;
        height: number;
        overflow: "hidden";
        zIndex: number;
    };
    stepNumber: {
        flex: number;
        alignItems: "center";
        justifyContent: "center";
        borderWidth: number;
        borderRadius: number;
        borderColor: string;
        backgroundColor: string;
    };
    stepNumberText: {
        fontSize: number;
        backgroundColor: string;
        color: string;
    };
    button: {
        padding: number;
    };
    buttonText: {
        color: string;
    };
    bottomBar: {
        marginTop: number;
        flexDirection: "row";
        justifyContent: "flex-end";
    };
    overlayRectangle: {
        position: "absolute";
        backgroundColor: string;
        left: number;
        top: number;
        bottom: number;
        right: number;
    };
    overlayContainer: {
        position: "absolute";
        left: number;
        top: number;
        bottom: number;
        right: number;
    };
};

interface Step {
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
interface ValueXY {
    x: number;
    y: number;
}
type SvgMaskPathFunction = (args: {
    size: Animated.ValueXY;
    position: Animated.ValueXY;
    canvasSize: ValueXY;
    radius: Animated.Value;
    step?: Step;
}) => string;
type EasingFunction = (value: number) => number;
type Labels = Partial<Record<"skip" | "previous" | "next" | "finish", string>>;
interface TooltipProps {
    labels: Labels;
}
interface TooltipAnimationValues {
    delay: number;
    duration: number;
    easing: EasingFunction;
}
interface CopilotOptions {
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
    style?: {
        [K in keyof typeof styles]?: Partial<ViewStyle>;
    };
    horizontalPosition?: Step["horizontalPosition"];
    tooltipAnimationValues?: {
        fadeIn: TooltipAnimationValues;
        fadeOut: TooltipAnimationValues;
    };
    delayBetweenSteps?: number;
    onStepChangeEvent?: () => void;
}

declare function walkthroughable<P = any>(WrappedComponent: React__default.ComponentType<P>): React__default.FunctionComponent<P>;

interface Props {
    name: string;
    order: number;
    text: string;
    children: React__default.ReactElement<any>;
    active?: boolean;
    edge?: {
        x?: number;
        y?: number;
        extraWidth?: number;
        extraHeight?: number;
    };
    horizontalPosition?: "left" | "right" | "auto";
    verticalPosition?: "top" | "bottom" | "auto";
    tooltipStyle?: ViewStyle;
    arrowStyle?: ViewStyle;
    backdropBorderRadius?: number;
    arrowPosition?: "left" | "center" | "right";
}
declare const CopilotStep: ({ name, order, text, children, active, edge, tooltipStyle, arrowStyle, horizontalPosition, verticalPosition, backdropBorderRadius, arrowPosition, }: Props) => React__default.ReactElement<any, string | React__default.JSXElementConstructor<any>>;

type Events = {
    start: undefined;
    stop: undefined;
    stepChange: Step | undefined;
};
interface CopilotContextType {
    registerStep: (step: Step) => void;
    unregisterStep: (stepName: string) => void;
    currentStep: Step | undefined;
    start: (fromStep?: string, suppliedScrollView?: ScrollView | null) => Promise<void>;
    stop: () => Promise<void>;
    goToNext: () => Promise<void>;
    goToNth: (n: number) => Promise<void>;
    goToPrev: () => Promise<void>;
    visible: boolean;
    copilotEvents: Emitter<Events>;
    isFirstStep: boolean;
    isLastStep: boolean;
    currentStepNumber: number;
    totalStepsNumber: number;
    delayBetweenSteps?: number;
}
declare const CopilotProvider: ({ verticalOffset, children, style, ...rest }: PropsWithChildren<CopilotOptions>) => React__default.JSX.Element;
declare const useCopilot: () => CopilotContextType;

declare const DefaultUI: {
    StepNumber: React$1.FunctionComponent<unknown>;
    Tooltip: ({ labels }: TooltipProps) => React$1.JSX.Element;
};

export { type CopilotOptions as CopilotProps, CopilotProvider, CopilotStep, DefaultUI, type Step, type TooltipProps, useCopilot, walkthroughable };
