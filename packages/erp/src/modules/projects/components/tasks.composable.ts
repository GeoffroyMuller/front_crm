import type { Task } from "@/types/project";
import useUI from "core/src/composables/ui";
import { useI18n } from "vue-i18n";
import useTasksStore from "../stores/tasks.store";

export default function useTask() {
  const { confirm } = useUI();
  const { t } = useI18n();

  const tasksStore = useTasksStore();

  async function removeTask(task: Task) {
    if (
      !(await confirm({
        message: t("pages.projects.sure_delete_task"),
        type: "danger",
        actions: [
          {
            action: "cancel",
            label: t("cancel"),
            buttonProps: {
              variant: "text",
              color: "black",
            },
          },
          {
            action: "confirm",
            label: t("delete"),
            buttonProps: {
              icon: "delete",
              color: "danger",
            },
          },
        ],
      }))
    ) {
      return;
    }
    console.error("removed");
  }

  async function toggleCompleted(task: Task) {}

  async function updateName(task: Task, val: string) {
    
  }

  return {
    removeTask,
    toggleCompleted,
    updateName,
  };
}
