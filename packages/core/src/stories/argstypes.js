const argstypes = {
  color: {
    control: { type: "select" },
    options: ["primary", "danger", "success", "warning", "white", "black"],
  },
  icon: {
    control: { type: "select" },
    options: ["home", "person"],
  },
};

export default function get(...args) {
  return args.reduce((acc, arg) => {
    return { ...acc, [arg]: argstypes[arg] };
  }, {});
}
