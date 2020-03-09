import { DynamicModule, Global, Inject, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ProbesModuleAsyncOptions } from './probes-module-async-options';
import { ProbesModuleOptions } from './probes-module-options.interface';
import { PROBES_MODULE_OPTIONS } from './probes.constants';
import { ProbeController } from './probes.controller';
import { ProbesService } from './probes.service';

@Global()
@Module({
  controllers: [ProbeController],
})
export class ProbesCoreModule {
  constructor(
    @Inject(PROBES_MODULE_OPTIONS)
    private readonly options: ProbesModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  private static async getServiceProvider(options: ProbesModuleOptions) {
    return {
      provide: ProbesService,
      useValue: new ProbesService(options),
    };
  }

  private static async getAsyncServiceProvider(
    options: ProbesModuleAsyncOptions,
  ) {
    return {
      provide: ProbesService,
      useFactory: async (o: ProbesModuleOptions) => {
        return new ProbesService(o);
      },
      imports: options.imports,
      inject: options.inject || [],
    };
  }

  static async forRoot(options: ProbesModuleOptions) {
    const probesModuleOptions = {
      provide: PROBES_MODULE_OPTIONS,
      useValue: options,
    };
    const serviceProvider = await this.getServiceProvider(options);
    return {
      module: ProbesCoreModule,
      providers: [serviceProvider, probesModuleOptions],
      exports: [serviceProvider],
    };
  }

  static async forRootAsync(
    options: ProbesModuleAsyncOptions,
  ): Promise<DynamicModule> {
    const probesModuleOptions = {
      provide: PROBES_MODULE_OPTIONS,
      useValue: options,
    };
    const serviceProvider = await this.getAsyncServiceProvider(options);
    return {
      module: ProbesCoreModule,
      providers: [serviceProvider, probesModuleOptions],
      exports: [serviceProvider],
      imports: options.imports,
    };
  }
}
