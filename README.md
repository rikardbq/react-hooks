# useDebounce

Simple debounce hook that exposes a function that takes another function as its parameter along with a time expressed in milliseconds.

This will prevent the argument function from being run on every call if called multiple times within the given timeframe.

```typescript
// example implementation in a React component
import { useDebounce } from "./useDebounce";

const TestComponent = () => {
    const debounce = useDebounce();

    return (
        <div>
            <button onClick={() => {
                debounce(() => {
                    console.log("CLICKED");
                }, 500);
            }>
                IM A BUTTON
            </button>
        </div>
    )
}
```

# useRateLimit

Simple rate limit hook that works similarly to a debouncer except it only limits the rate at which the supplied function can be called, at a rate of 1/\<milliseconds_supplied\>.

```typescript
// example implementation in a React component
import { useRateLimit } from "./useRateLimit";

const TestComponent = () => {
    const limitRate = useRateLimit();

    return (
        <div>
            <button onClick={() => {
                limitRate(() => {
                    console.log("CLICKED");
                }, 500);
            }>
                IM A BUTTON
            </button>
        </div>
    )
}
```

# useGamepad (wip)

A hook for simplifying usage of the GamepadAPI. Everything isn't implemented yet but will soon be as part of another little project I'm working on for myself.

```typescript
// example implementation in a React component
import { useMemo, useRef, useState } from "react";
import { useGamepad } from "./useGamepad";

const TestComponent = () => {
    const { 
        gamepads, 
        isButtonPressed, 
        moveX, 
        moveY 
    } = useGamepad({ 
        pollRate: 16, 
        stickDeadZone: 0.1 
    });
    const [gamepad1, ..._rest] = useMemo(() => gamepads, [gamepads]);
    
    return (
        <div>
            {isButtonPressed(gamepad1, "A") ? (
                <h1>
                    A PRESSED
                </h1>
            ) : null}
            {moveX(gamepad1, "LEFT_STICK", "right") ? (
                <h1>
                    MOVED RIGHT WITH LEFT STICK
                </h1>
            ): null}
            {moveY(gamepad1, "RIGHT_STICK", "up") ? (
                <h1>
                    MOVED UP WITH RIGHT STICK
                </h1>
            ): null}
        </div>
    );
};

```

A good thing to do if manipulating something like a state variable is to use a rate limiter, this prevents the gamepad input from changing that state too fast.

```typescript
// example
...
const limitRate = useRateLimit();
const [focusedElement, setFocusedElement] = useState(0);

// without a rate limit this will send so many setState calls that 
// the focused element will not transition smoothly but instead 
// almost jump directly to the end of the elements that are 
// able to be focused, depending on the implementation of course.

// this here is just a random example of setting some state
if (gamepad1 && isButtonPressed(gamepad1, "DPAD_LEFT")) {
    limitRate(() => setFocusedElement(focusedElement - 1), 200);
}
...
```
