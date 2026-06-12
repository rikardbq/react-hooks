import { useRef, useCallback } from "react";

export const useRateLimit = () => {
    const rlNowRef = useRef<Record<string, number>>({});
    const rateLimiter = useCallback((cb: Function, time: number = 250, id: string = "__default##") => {
        const rlNowCurr = rlNowRef.current;
        const now = Date.now();
        if (!rlNowCurr[id]) {
            rlNowCurr[id] = now;
        }
        if (now > rlNowCurr[id] + time) {
            rlNowCurr[id] = now;
            cb();
        }
    }, []);

    return rateLimiter;
};
