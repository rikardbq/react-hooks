import { useRef, useCallback } from "react";

export const useRateLimit = () => {
    const id = useRef<Function | undefined>(undefined);
    const timer = useRef<number | undefined>(undefined);
    const executeTimer = useRef<number | undefined>(undefined);
    const rateLimiter = useCallback(
        (cb: Function, time: number = 250) => {
            clearTimeout(executeTimer.current);
            executeTimer.current = setTimeout(() => {
                id.current = undefined;
                clearTimeout(timer.current);
            }, time);

            timer.current = setTimeout(() => {
                if (id.current === cb) {
                    cb();
                }
            }, time);
            id.current = cb;
        },
        [],
    );

    return rateLimiter;
};
