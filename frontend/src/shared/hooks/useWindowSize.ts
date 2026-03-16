import { useState, useEffect } from 'react';

interface WindowSize {
    width: number;
    height: number;
}

const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        // Вызываем handleResize сразу после монтирования компонента,
        // чтобы установить начальные значения ширины и высоты окна.
        handleResize();

        // Очищаем слушателя событий при размонтировании компонента.
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

export default useWindowSize;
