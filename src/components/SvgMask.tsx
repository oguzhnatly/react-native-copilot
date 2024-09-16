import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import type { MaskProps, SvgMaskPathFunction, ValueXY } from "../types";

const AnimatedSvgPath = Animated.createAnimatedComponent(Path);
const windowDimensions = Dimensions.get("window");

const defaultSvgPath: SvgMaskPathFunction = ({
  size,
  position,
  canvasSize,
  radius,
}): string => {
  const positionX = (position.x as any)._value as number;
  const positionY = (position.y as any)._value as number;
  const sizeX = (size.x as any)._value as number;
  const sizeY = (size.y as any)._value as number;
  const radiusValue = (radius as any)._value as number;

  const minSize = Math.min(sizeX, sizeY);
  const _radius = Math.max(Math.min(minSize / 2, radiusValue), 0);
  const lx = sizeX - _radius * 2;
  const ly = sizeY - _radius * 2;

  return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0Z\
M${positionX + sizeX - lx - _radius},${positionY} h${lx} a${_radius},${_radius} 0 0 1 ${_radius},${_radius}\
v${ly} a${_radius},${_radius} 0 0 1 -${_radius},${_radius}\
h-${lx} a${_radius},${_radius} 0 0 1 -${_radius},-${_radius}\
v-${ly} a${_radius},${_radius} 0 0 1 ${_radius},-${_radius} z`;
};

export const SvgMask = ({
  size,
  position,
  style,
  easing = Easing.linear,
  animationDuration = 300,
  animated,
  backdropColor,
  svgMaskPath = defaultSvgPath,
  onClick,
  currentStep,
}: MaskProps) => {
  const [canvasSize, setCanvasSize] = useState<ValueXY>({
    x: windowDimensions.width,
    y: windowDimensions.height,
  });
  const sizeValue = useRef<Animated.ValueXY>(
    new Animated.ValueXY(size),
  ).current;
  const positionValue = useRef<Animated.ValueXY>(
    new Animated.ValueXY(position),
  ).current;
  const radiusValue = useRef<Animated.Value>(
    new Animated.Value(currentStep.backdropBorderRadius ?? 0),
  ).current;
  const maskRef = useRef<any>(null);

  const animationListener = useCallback(() => {
    const d: string = svgMaskPath({
      size: sizeValue,
      position: positionValue,
      canvasSize,
      radius: radiusValue,
      step: currentStep,
    });

    if (maskRef.current) {
      maskRef.current.setNativeProps({ d });
    }
  }, [
    canvasSize,
    currentStep,
    svgMaskPath,
    positionValue,
    sizeValue,
    radiusValue,
  ]);

  const animate = useCallback(
    (
      toSize: ValueXY = size,
      toPosition: ValueXY = position,
      toRadius: number = currentStep.backdropBorderRadius ?? 0,
    ) => {
      if (animated) {
        Animated.parallel([
          Animated.timing(sizeValue, {
            toValue: toSize,
            duration: animationDuration,
            easing,
            useNativeDriver: false,
          }),
          Animated.timing(positionValue, {
            toValue: toPosition,
            duration: animationDuration,
            easing,
            useNativeDriver: false,
          }),
          Animated.timing(radiusValue, {
            toValue: toRadius,
            duration: animationDuration,
            easing,
            useNativeDriver: false,
          }),
        ]).start();
      } else {
        sizeValue.setValue(toSize);
        positionValue.setValue(toPosition);
      }
    },
    [
      animated,
      animationDuration,
      easing,
      positionValue,
      position,
      size,
      sizeValue,
      radiusValue,
      currentStep,
    ],
  );

  useEffect(() => {
    const id = positionValue.addListener(animationListener);
    return () => {
      positionValue.removeListener(id);
    };
  }, [animationListener, positionValue]);

  useEffect(() => {
    if (size && position && currentStep.backdropBorderRadius) {
      animate(size, position, currentStep.backdropBorderRadius);
    }
  }, [animate, position, size, currentStep]);

  const handleLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }: LayoutChangeEvent) => {
    setCanvasSize({
      x: width,
      y: height,
    });
  };

  return (
    <View
      style={style}
      onLayout={handleLayout}
      onStartShouldSetResponder={onClick}
    >
      {canvasSize ? (
        <Svg pointerEvents="none" width={canvasSize.x} height={canvasSize.y}>
          <AnimatedSvgPath
            ref={maskRef}
            fill={backdropColor}
            fillRule="evenodd"
            strokeWidth={1}
            d={svgMaskPath({
              size: sizeValue,
              position: positionValue,
              canvasSize,
              radius: radiusValue,
              step: currentStep,
            })}
          />
        </Svg>
      ) : null}
    </View>
  );
};
