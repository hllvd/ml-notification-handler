export const getOnlyNumbers = (str: string) => {
  const numericValue = str.match(/\d+/)
  return numericValue ? numericValue[0] : null
}
