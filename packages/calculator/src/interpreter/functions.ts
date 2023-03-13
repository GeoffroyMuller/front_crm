function sqrt(args: Array<any>) {
  return Math.sqrt(args[0]);
}

function pow(args: Array<any>) {
  const base = args[0];
  const exponent = args[1];
  return Math.pow(base, exponent);
}

export default {
  pow,
  power: pow,
  sqrt,
  root: sqrt,
} as { [key: string]: (args: Array<any>) => any };
