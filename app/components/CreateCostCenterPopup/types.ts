import { Dispatch, SetStateAction } from 'react';

type FormTypes = {
	description: string
};

type CreateCostCenterPopupProps = {
	closeFunction: Dispatch<SetStateAction<boolean>>
}

type ErrorType = {
	message: string;
}

export type { FormTypes, CreateCostCenterPopupProps, ErrorType };