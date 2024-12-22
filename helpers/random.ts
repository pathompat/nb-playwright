const randomAlphanumericLowerCase = (length: number = 6) =>  {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const randomNumber = (min: number = 0, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 

const randomFloatingNumber = (min: number = 0, max: number) => {
  const randomFloat = Math.random() * (max - min) + min;
  return parseFloat(randomFloat.toFixed(2));
}

export { randomAlphanumericLowerCase, randomNumber, randomFloatingNumber }