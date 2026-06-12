import { useRef, useCallback, useEffect } from "react";

export const useDebounce = () => {
    const timerRef = useRef<Record<string, number>>({});
    const debouncer = useCallback(
        (cb: Function, time: number = 250, id: string = "__default##") => {
            const timerCurr = timerRef.current;
            clearTimeout(timerCurr[id]);
            timerCurr[id] = setTimeout(() => {
                cb();
            }, time);
        },
        [],
    );

    useEffect(() => {
        return () => {
            Object.values(timerRef.current).forEach((timer) => {
                clearTimeout(timer);
            });
        };
    }, []);

    return debouncer;
};
