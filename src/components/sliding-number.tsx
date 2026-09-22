'use client';
import { memo, useEffect, useState } from 'react';
import {
  MotionValue,
  motion,
  useSpring,
  useTransform,
  motionValue,
} from 'motion/react';
import useMeasure from 'react-use-measure';

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 26,
  mass: 0.35,
};

// Har bir raqam (0-9) — memo: ota har freymda re-render bo'lganda ham,
// props o'zgarmasa qayta chizilmaydi. Animatsiya motion value orqali
// to'g'ridan-to'g'ri DOM'da yuradi (React rendersiz).
const NumberCell = memo(function NumberCell({
  mv,
  number,
  height,
}: {
  mv: MotionValue<number>;
  number: number;
  height: number;
}) {
  const y = useTransform(mv, (latest) => {
    const placeValue = ((latest % 10) + 10) % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className='absolute inset-0 flex items-center justify-center'
    >
      {number}
    </motion.span>
  );
});

function Digit({ value, place }: { value: number; place: number }) {
  const valueRoundedToPlace = Math.floor(value / place) % 10;
  // Balandlik bitta o'lchovda olinadi (oldin har 10 raqam alohida
  // ResizeObserver ochardi — 10x ortiqcha kuzatuvchi).
  const [ref, bounds] = useMeasure();
  const height = bounds.height || 0;
  const [initial] = useState(() => motionValue(valueRoundedToPlace));
  const animatedValue = useSpring(initial, TRANSITION);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div
      ref={ref}
      className='relative inline-block w-[1ch] overflow-x-visible overflow-y-clip leading-none tabular-nums'
    >
      <div className='invisible'>0</div>
      {height > 0 &&
        Array.from({ length: 10 }, (_, i) => (
          <NumberCell key={i} mv={animatedValue} number={i} height={height} />
        ))}
    </div>
  );
}

type SlidingNumberProps = {
  value: number;
  padStart?: boolean;
  decimalSeparator?: string;
};

export function SlidingNumber({
  value,
  padStart = false,
  decimalSeparator = '.',
}: SlidingNumberProps) {
  const absValue = Math.abs(value);
  const [integerPart, decimalPart] = absValue.toString().split('.');
  const integerValue = parseInt(integerPart, 10);
  const paddedInteger =
    padStart && integerValue < 10 ? `0${integerPart}` : integerPart;
  const integerDigits = paddedInteger.split('');
  const integerPlaces = integerDigits.map((_, i) =>
    Math.pow(10, integerDigits.length - i - 1)
  );

  return (
    <div className='flex items-center'>
      {value < 0 && '-'}
      {integerDigits.map((_, index) => (
        <Digit
          key={`pos-${integerPlaces[index]}`}
          value={integerValue}
          place={integerPlaces[index]}
        />
      ))}
      {decimalPart && (
        <>
          <span>{decimalSeparator}</span>
          {decimalPart.split('').map((_, index) => (
            <Digit
              key={`decimal-${index}`}
              value={parseInt(decimalPart, 10)}
              place={Math.pow(10, decimalPart.length - index - 1)}
            />
          ))}
        </>
      )}
    </div>
  );
}
