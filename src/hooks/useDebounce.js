import { useEffect, useState } from "react";

export const useDebounce = (value, delay = 500, shouldDebounce = true) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            shouldDebounce && setDebounceValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debounceValue;
};
