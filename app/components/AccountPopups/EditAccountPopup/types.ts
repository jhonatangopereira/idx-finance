type EditAccountPopupProps = {
    accountName: string,
    bank: string,
    type: string,
    modality: string,
    description: string,
    onCloseFunction: (args?: any) => void,
    id: number,  
    finalBalance: string  
};

export type { EditAccountPopupProps };