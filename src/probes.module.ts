import { DynamicModule, Module } from "@nestjs/common";
import { ProbesCoreModule } from "./probes-core.module";
import { ProbesModuleAsyncOptions } from "./probes-module-async-options";
import { ProbesModuleOptions } from "./probes-module-options.interface";

@Module({})
export class ProbesModule {
  static forRoot(options: ProbesModuleOptions): DynamicModule {
    return {
      module: ProbesModule,
      imports: [ProbesCoreModule.forRoot(options)]
    };
  }

  static forRootAsync(options: ProbesModuleAsyncOptions): DynamicModule {
    return {
      module: ProbesModule,
      imports: [ProbesCoreModule.forRootAsync(options)]
    };
  }
}
