import {
  DynamicModule,
  Global,
  Inject,
  Module,
  Provider,
} from '@nestjs/common';
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

  private static getAsyncServiceProvider(
    options: ProbesModuleAsyncOptions,
  ): Provider<ProbesService> {
    return {
      provide: ProbesService,
      useFactory: (o: ProbesModuleOptions) => {
        return new ProbesService(o);
      },
      inject: [PROBES_MODULE_OPTIONS],
    };
  }

  private static getAsyncOptionsProvider(
    options: ProbesModuleAsyncOptions,
  ): Provider<ProbesModuleOptions> {
    return {
      provide: PROBES_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: [...options.inject],
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
      providers: [probesModuleOptions, serviceProvider],
      exports: [serviceProvider],
    };
  }

  static async forRootAsync(
    options: ProbesModuleAsyncOptions,
  ): Promise<DynamicModule> {
    const probesModuleOptions = this.getAsyncOptionsProvider(options);
    const serviceProvider = this.getAsyncServiceProvider(options);
    return {
      module: ProbesCoreModule,
      providers: [probesModuleOptions, serviceProvider],
      exports: [serviceProvider],
      imports: options.imports,
    };
  }
}
