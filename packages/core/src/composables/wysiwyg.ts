import type { Ref } from "vue";

interface Wysiwyg {
  execCommand: {
    bold: () => void;
  };
}
interface UseWysiwygProps {
  value: Ref<string>;
}
export default function useWysiwyg(props: UseWysiwygProps): Wysiwyg {
  const execCommand = {
    bold: () => {
      const strong = document.createElement("strong");
      const selection = window.getSelection();
      if (selection == null) return;
      const selectedTextRange = selection.getRangeAt(0);
      selectedTextRange.surroundContents(strong);
    },
  };

  return {
    execCommand,
  };
}
