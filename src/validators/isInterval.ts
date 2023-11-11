export const isInterval = (value: string | number | undefined): boolean => {
    console.log(value)
    return !isNaN(value as any);
}