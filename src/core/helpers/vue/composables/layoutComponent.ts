import { onMounted, watch, type Ref } from "vue";

// @TODO : les props ne sont pas watch mais juste appliqué au début ...
export interface LayoutComponentProps {
  ref: Ref;

  gap?: number;
  p?: number;
  pr?: number;
  pl?: number;
  pt?: number;
  pb?: number;

  m?: number;
  mr?: number;
  ml?: number;
  mt?: number;
  mb?: number;

  mx?: number;
  my?: number;
  px?: number;
  py?: number;
}

export default function useLayoutComponent(props: LayoutComponentProps) {
  function watchCssProp(
    cssprop: string | string[],
    prop: keyof LayoutComponentProps
  ) {
    watch(
      () => props[prop],
      () => {
        if (props.ref.value && props[prop]) {
          if (Array.isArray(cssprop)) {
            cssprop.forEach((cp) => {
              props.ref.value.style.setProperty(cp, props[prop]);
            });
          } else {
            props.ref.value.style.setProperty(cssprop, props[prop]);
          }
        }
      },
      { immediate: true }
    );
  }

  onMounted(() => {
    watchCssProp("--gap", "gap");

    watchCssProp(["--pt", "--pb", "--pr", "--pl"], "p");
    watchCssProp(["--pt", "--pb"], "py");
    watchCssProp(["--pr", "--pl"], "px");
    watchCssProp("--pr", "pr");
    watchCssProp("--pl", "pl");
    watchCssProp("--pt", "pt");
    watchCssProp("--pb", "pb");

    watchCssProp(["--mt", "--mb", "--mr", "--ml"], "m");
    watchCssProp(["--mt", "--mb"], "my");
    watchCssProp(["--mr", "--ml"], "mx");
    watchCssProp("--mr", "mr");
    watchCssProp("--ml", "ml");
    watchCssProp("--mt", "mt");
    watchCssProp("--mb", "mb");
  });
}
