import type { Task } from "@/types/project";
import useUI from "core/src/composables/ui";
import { useI18n } from "vue-i18n";
import useTasksStore from "../stores/tasks.store";

export default function useTask() {
  const { confirm, toast } = useUI();
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
    try {
      await tasksStore.delete(task.id);
      toast({
        type: "info",
        message: t("pages.projects.tasks-deleted"),
      });
    } catch (err) {
      console.error(err);
      toast({
        type: "danger",
        message: t("error_occured"),
      });
    }
  }

  async function toggleCompleted(task: Task) {
    try {
      const completed = !task.completed;
      await tasksStore.update(task.id, { completed });
      if (completed) {
        toast({
          type: "success",
          message: t("pages.projects.completed"),
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        type: "danger",
        message: t("error_occured"),
      });
    }
  }

  async function updateName(task: Task, val: string) {
    try {
      await tasksStore.update(task.id, { name: val });
    } catch (err) {
      console.error(err);
      toast({
        type: "danger",
        message: t("error_occured"),
      });
    }
  }

  return {
    removeTask,
    toggleCompleted,
    updateName,
  };
}
