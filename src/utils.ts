export function fromLibIoErr(e: Error): Error {
  console.error(e.cause);
  return new Error(e.message);
}
