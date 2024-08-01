import { Dispatch, SetStateAction } from 'react';

type FormTypes = {
	description: string
};

type CreateCategoryPopupProps = {
	closeFunction: Dispatch<SetStateAction<boolean>>
}

type ErrorType = {
	message: string;
}

export type { FormTypes, CreateCategoryPopupProps, ErrorType };