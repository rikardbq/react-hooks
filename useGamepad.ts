import { useCallback, useEffect, useState } from "react";

// WIP
// UTILITY
export const GAMEPAD_BUTTONS = {
    A: 0,
    X: 1,
    B: 2,
    Y: 3,
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15,
};

export const GAMEPAD_AXES = {
    LEFT_STICK: {
        X_AXIS: 0,
        Y_AXIS: 1,
    },
    RIGHT_STICK: {
        X_AXIS: 2,
        Y_AXIS: 3,
    },
};

type GamepadButtons = typeof GAMEPAD_BUTTONS;
type GamepadAxes = typeof GAMEPAD_AXES;
type XDirections = "left" | "right";
type YDirections = "up" | "down";

const isButtonPressed = (gamepad: Gamepad, button: keyof GamepadButtons) => {
    return gamepad.buttons[(GAMEPAD_BUTTONS as GamepadButtons)[button]].pressed;
};

const moveX =
    (deadZone: number) =>
    (gamepad: Gamepad, stick: keyof GamepadAxes, direction: XDirections) => {
        const xVal = gamepad.axes[(GAMEPAD_AXES as GamepadAxes)[stick].X_AXIS];
        if (direction === "left") return xVal < 0 - deadZone;
        if (direction === "right") return xVal > 0 + deadZone;
    };

const moveY =
    (deadZone: number) =>
    (gamepad: Gamepad, stick: keyof GamepadAxes, direction: YDirections) => {
        const yVal = gamepad.axes[(GAMEPAD_AXES as GamepadAxes)[stick].Y_AXIS];
        if (direction === "up") return yVal < 0 - deadZone;
        if (direction === "down") return yVal > 0 + deadZone;
    };
// UTILITY END

type Gamepads = (Gamepad | null)[];
interface GamepadUtilsOptions {
    pollRate?: number;
    stickDeadZone?: number;
}

export interface GamepadUtils {
    gamepads: Gamepads;
    isButtonPressed: (
        gamepad: Gamepad,
        button: keyof GamepadButtons,
    ) => boolean;
    moveX: (
        gamepad: Gamepad,
        stick: keyof GamepadAxes,
        direction: XDirections,
    ) => boolean | undefined;
    moveY: (
        gamepad: Gamepad,
        stick: keyof GamepadAxes,
        direction: YDirections,
    ) => boolean | undefined;
}

export const useGamepad = ({
    pollRate = 100,
    stickDeadZone = 0.1,
}: GamepadUtilsOptions): GamepadUtils => {
    const [gamepads, setGamepads] = useState<Gamepads>([]);

    const connectedHandler = useCallback((ev: GamepadEvent) => {
        const evGamepad = ev.gamepad;
        const navigatorGamepads = navigator.getGamepads();

        if (navigatorGamepads[evGamepad.index]) {
            console.debug(`GAMEPAD ${evGamepad.index} EXISTS, POPULATE LIST`);
            setGamepads(navigatorGamepads);
        }
    }, []);

    const disconnectedHandler = useCallback((ev: GamepadEvent) => {
        const gamepad = ev.gamepad;
        setGamepads(gamepads.filter((_x: Gamepad, idx: number) => idx === gamepad.index));
    }, []);

    useEffect(() => {
        const navigatorGamepads = navigator.getGamepads();
        if (navigatorGamepads.length === 0) {
            return;
        }

        setTimeout(() => {
            setGamepads(navigatorGamepads);
        }, pollRate);
    });

    useEffect(() => {
        window.addEventListener("gamepadconnected", connectedHandler);
        window.addEventListener("gamepaddisconnected", disconnectedHandler);

        return () => {
            window.removeEventListener("gamepadconnected", connectedHandler);
            window.removeEventListener(
                "gamepaddisconnected",
                disconnectedHandler,
            );
        };
    }, []);

    return {
        gamepads,
        isButtonPressed,
        moveX: moveX(stickDeadZone!),
        moveY: moveY(stickDeadZone!),
    };
};
