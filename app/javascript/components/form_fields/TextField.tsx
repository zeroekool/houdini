
// License: LGPL-3.0-or-later
import React, { MutableRefObject } from "react";

import MuiTextField from '@material-ui/core/TextField';
import { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import { Control, ControllerFieldState, ControllerRenderProps, FormState, useController } from "react-hook-form";

interface ConversionProps<T extends unknown = unknown> {
	disabled?:boolean;
	field: ControllerRenderProps<T, string>;
	fieldState: ControllerFieldState;
	formState: FormState<T>;
	helperText?:React.ReactNode;
	inputRef?: MutableRefObject<HTMLInputElement|null>;
	onBlur?:(e:React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}


export function fieldToTextField({
	field: { onBlur: fieldOnBlur, ref:refCallback, ...field },
	fieldState: {error, isTouched},
	formState: { isSubmitting},
	onBlur,
	helperText,
	disabled,
	inputRef,
	...props
}: ConversionProps): MuiTextFieldProps {
	const fieldError = error?.message;
	const showError = isTouched && !!fieldError;

	return {
		error: showError,
		helperText: showError ? fieldError : helperText,
		disabled: disabled ?? isSubmitting,
		onBlur:
			onBlur ??
			function () {
				fieldOnBlur();
			},
		...field,
		...props,

		inputRef: (e) => {
			refCallback(e);
			if (inputRef) {
				inputRef.current = e;
			}
		},
	};
}


export type ITextFieldProps<TFieldValues=unknown> = Omit<MuiTextFieldProps, 'value' | 'error' |'inputRef'> & { control: Control<TFieldValues> };

/**
 * A text field which accepts a Money value, uses useI18nCurrencyInput and returns a Money value for various callbacks
 *
 * @param {ITextFieldProps} { children, form, field, currencyDisplay, useGrouping, allowEmpty, selectAllOnFocus, ...props }
 * @returns {JSX.Element}
 */
function TextField<TFieldValues=unknown>({ children, control, name, ...props }: ITextFieldProps<TFieldValues>): JSX.Element {
	const {
		field,
		fieldState,
		formState,
	} = useController({
		name,
		control,
	});



	return <MuiTextField {...fieldToTextField({ field, fieldState, formState, ...props })}>
		{children}
	</MuiTextField>;

}

export default TextField;