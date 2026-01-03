import React, { useEffect, useRef } from 'react';

type Props = {
	externalRef?: React.RefObject<HTMLInputElement | null>;
	name?: string;
	value?: string;
	className?: string;
	placeHolder?: string;
	focus?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export function TextInput({
	externalRef,
	name,
	value,
	className,
	placeHolder,
	focus,
	onChange,
	onFocus,
	onBlur,
}: Props) {
	const internalRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (focus && internalRef.current) {
			internalRef.current.focus();
		}
	}, [focus]);

	// if parent provided externalRef (RefObject), sync it to point to the actual input element
	useEffect(() => {
		if (!externalRef) return;
		try {
			(externalRef as React.MutableRefObject<HTMLInputElement | null>).current =
				internalRef.current;
		} catch (_) {
			// ignore if externalRef is a callback ref (not expected here)
		}
		return () => {
			try {
				(
					externalRef as React.MutableRefObject<HTMLInputElement | null>
				).current = null;
			} catch (_) {}
		};
	}, [externalRef, internalRef.current]);

	return (
		<div
			className={
				(className || '') +
				' flex flex-1 cursor-pointer items-center rounded-lg border border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-indigo-500'
			}
		>
			<input
				ref={internalRef}
				type="text"
				name={name}
				value={value}
				onChange={(e) => onChange && onChange(e)}
				onFocus={(e) => onFocus && onFocus(e)}
				onBlur={(e) => onBlur && onBlur(e)}
				placeholder={placeHolder}
				className="h-full w-full rounded-lg px-4 py-2 text-gray-100 focus:border-transparent focus:outline-none"
			/>
		</div>
	);
}

export default TextInput;
