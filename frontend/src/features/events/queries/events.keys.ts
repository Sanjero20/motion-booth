export const eventKeys = {
  all: ["events"] as const,

  lists: () => [...eventKeys.all, "list"] as const,

  details: () => [...eventKeys.all, "detail"] as const,

  detail: (id: string) => [...eventKeys.details(), id] as const,

  background: (id: string) => [...eventKeys.all, "background", id] as const,
};
