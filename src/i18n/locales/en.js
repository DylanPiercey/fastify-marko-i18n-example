export const introWelcome = "Welcome to {{name}}!";
export const introDescription = "This demo works in the {{environment}}.";

export function support(obj) {
  let hour = Math.floor(Math.random() * 3) + 9;
  let str = `For questions, I'm available on ${obj.date.toLocaleDateString()}`;
  str += `, any time after ${hour}:00.`;
  return str;
}
