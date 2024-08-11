import { Dispatch, SetStateAction } from 'react';

type FormTypes = {
	name: string
};

type CreateSupplierPopupProps = {
	closeFunction: Dispatch<SetStateAction<boolean>>
}

type ErrorType = {
	message: string;
}

export type { FormTypes, CreateSupplierPopupProps, ErrorType };