import React, { useEffect, useMemo, useRef } from "react";
import type { NativeMethods, ViewStyle } from "react-native";

import { useCopilot } from "../contexts/CopilotProvider";

interface Props {
  name: string;
  order: number;
  text: string;
  children: React.ReactElement<any>;
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

export const CopilotStep = ({
  name,
  order,
  text,
  children,
  active = true,
  edge = {},
  tooltipStyle = {},
  arrowStyle = {},
  horizontalPosition = "auto",
  verticalPosition = "auto",
  backdropBorderRadius = 0,
  arrowPosition = "left",
}: Props) => {
  const registeredName = useRef<string | null>(null);
  const { registerStep, unregisterStep } = useCopilot();
  const wrapperRef = React.useRef<NativeMethods | null>(null);
  const safeEdge = {
    x: edge.x ?? 0,
    y: edge.y ?? 0,
    extraWidth: edge.extraWidth ?? 0,
    extraHeight: edge.extraHeight ?? 0,
  };

  const measure = async () => {
    return await new Promise<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>((resolve) => {
      const measure = () => {
        // Wait until the wrapper element appears
        if (wrapperRef.current != null && "measure" in wrapperRef.current) {
          wrapperRef.current.measure((_ox, _oy, width, height, x, y) => {
            resolve({
              x: x + safeEdge.x,
              y: y + safeEdge.y,
              width: width + safeEdge.extraWidth,
              height: height + safeEdge.extraHeight,
            });
          });
        } else {
          requestAnimationFrame(measure);
        }
      };

      measure();
    });
  };

  useEffect(() => {
    if (active) {
      if (registeredName.current && registeredName.current !== name) {
        unregisterStep(registeredName.current);
      }
      registerStep({
        name,
        text,
        order,
        measure,
        wrapperRef,
        visible: true,
        style: tooltipStyle,
        arrowStyle,
        horizontalPosition,
        verticalPosition,
        backdropBorderRadius,
        arrowPosition,
      });
      registeredName.current = name;
    }
  }, [name, order, text, registerStep, unregisterStep, active]);

  useEffect(() => {
    if (active) {
      return () => {
        if (registeredName.current) {
          unregisterStep(registeredName.current);
        }
      };
    }
  }, [name, unregisterStep, active]);

  const copilotProps = useMemo(
    () => ({
      ref: wrapperRef,
      onLayout: () => {}, // Android hack
    }),
    [],
  );

  return React.cloneElement(children, { copilot: copilotProps });
};
