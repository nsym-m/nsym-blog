import React, { PropsWithChildren } from "react";

declare module "react" {
  type FCX<P = {}> = React.FC<PropsWithChildren<P & { className?: string }>>;
  type VFCX<P = {}> = React.FC<PropsWithChildren<P & { className?: string }>>;
}
