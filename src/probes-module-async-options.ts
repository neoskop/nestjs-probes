import { ModuleMetadata } from "@nestjs/common/interfaces";
import { ProbesModuleOptions } from "./probes-module-options.interface";

export interface ProbesModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (
    ...args: any[]
  ) => Promise<ProbesModuleOptions> | ProbesModuleOptions;
  inject?: any[];
}
