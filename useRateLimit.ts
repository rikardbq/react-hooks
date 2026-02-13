import { useRef, useCallback, useEffect } from "react";

export const useRateLimit = () => {
    const timer = useRef<number | undefined>(undefined);
    const executeTimer = useRef<number | undefined>(undefined);
    const rateLimiter = useCallback((cb: Function, time: number = 250) => {
        clearTimeout(executeTimer.current);
        executeTimer.current = setTimeout(() => {
            clearTimeout(timer.current);
        }, time);

        timer.current = setTimeout(() => {
            cb();
        }, time);
    }, []);

    useEffect(() => {
        return () => {
            clearTimeout(executeTimer.current);
            clearTimeout(timer.current);
        };
    }, []);

    return rateLimiter;
};
