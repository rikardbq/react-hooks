import { useCallback, useEffect, useState } from "react";

// UTILITY
const GAMEPAD_BUTTONS = {
    XBOX: {
        A: 0,
        B: 1,
        X: 2,
        Y: 3,
        LB: 4,
        RB: 5,
        LT: 6,
        RT: 7,
        SELECT: 8,
        START: 9,
        THUMB_LEFT: 10,
        THUMB_RIGHT: 11,
        DPAD_UP: 12,
        DPAD_DOWN: 13,
        DPAD_LEFT: 14,
        DPAD_RIGHT: 15,
    },
};

const GAMEPAD_AXES = {
    LEFT_STICK: {
        X_AXIS: 0,
        Y_AXIS: 1,
    },
    RIGHT_STICK: {
        X_AXIS: 2,
        Y_AXIS: 3,
    },
};

type GamepadButtons = {
    [K in keyof typeof GAMEPAD_BUTTONS]: `${K & string}.${keyof (typeof GAMEPAD_BUTTONS)[K] & string}`;
}[keyof typeof GAMEPAD_BUTTONS];
type GamepadAxes = typeof GAMEPAD_AXES;
type XDirections = "left" | "right";
type YDirections = "up" | "down";

const isButtonPressed = (gamepad: Gamepad, button: GamepadButtons) => {
    const [controller, key] = button.split(".") as [
        keyof typeof GAMEPAD_BUTTONS,
        string,
    ];
    const val = (GAMEPAD_BUTTONS[controller] as any)[key];
    return gamepad.buttons[val].pressed;
};

const moveX =
    (deadzone: number) =>
    (gamepad: Gamepad, stick: keyof GamepadAxes, direction: XDirections) => {
        const xVal = gamepad.axes[(GAMEPAD_AXES as GamepadAxes)[stick].X_AXIS];
        if (direction === "left") return xVal < 0 - deadzone;
        if (direction === "right") return xVal > 0 + deadzone;
    };

const moveY =
    (deadzone: number) =>
    (gamepad: Gamepad, stick: keyof GamepadAxes, direction: YDirections) => {
        const yVal = gamepad.axes[(GAMEPAD_AXES as GamepadAxes)[stick].Y_AXIS];
        if (direction === "up") return yVal < 0 - deadzone;
        if (direction === "down") return yVal > 0 + deadzone;
    };
// UTILITY END

type Gamepads = (Gamepad | null)[];
interface GamepadUtilsOptions {
    pollRate?: number;
    stickDeadzone?: number;
}

export interface GamepadUtils {
    gamepads: Gamepads;
    isButtonPressed: (gamepad: Gamepad, button: GamepadButtons) => boolean;
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
    stickDeadzone = 0.1,
}: GamepadUtilsOptions): GamepadUtils => {
    const [gamepads, setGamepads] = useState<Gamepads>([]);

    const connectedHandler = useCallback((ev: GamepadEvent) => {
        const evGamepad = ev.gamepad;
        const navigatorGamepads = navigator.getGamepads();

        if (navigatorGamepads[evGamepad.index]) {
            console.debug(`GAMEPAD ${evGamepad.index} CONNECTED`);
            setGamepads(navigatorGamepads);
        }
    }, []);

    const disconnectedHandler = useCallback((ev: GamepadEvent) => {
        const evGamepad = ev.gamepad;
        console.debug(`GAMEPAD ${evGamepad.index} DISCONNECTED`);
        setGamepads(gamepads.filter((_x, idx) => idx === evGamepad.index));
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
        moveX: moveX(stickDeadzone!),
        moveY: moveY(stickDeadzone!),
    };
};
