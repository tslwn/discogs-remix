import type { DataFunctionArgs } from "@remix-run/server-runtime";

export type LoaderData<T extends (args: DataFunctionArgs) => any> = Awaited<
  ReturnType<T>
>;
