type ButtonFormProps = {
    type: "submit" | "reset" | "button" | undefined,
    text: string,
    primary?: boolean,
    secondary?: boolean,
    onclickFunction?: (args?: any) => void
};

export type { ButtonFormProps };