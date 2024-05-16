import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { ProbesModuleOptions } from './probes-module-options.interface';
import { PROBES_MODULE_OPTIONS } from './probes.constants';
import { ProbeType } from './types';

@Injectable()
export class ProbesService {
  private statusMap: { [key in ProbeType]?: boolean } = {};

  constructor(
    @Inject(PROBES_MODULE_OPTIONS)
    private readonly options: ProbesModuleOptions,
  ) {}

  public async checkProbe(probeName: ProbeType): Promise<boolean> {
    const check = this.options.checks[probeName];

    if (check !== undefined) {
      let newStatus: boolean;

      if (typeof check === 'function') {
        const result = await check();

        if (typeof result === 'object') {
          newStatus = this.checkTerminusHealthResults([result]);
        } else if (typeof result === 'boolean') {
          newStatus = result;
        }
      } else {
        const results = await Promise.all(check.map(async (f) => await f()));
        newStatus = this.checkTerminusHealthResults(results);
      }

      this.statusMap[probeName] = newStatus;
    } else {
      this.statusMap[probeName] = true;
    }

    return this.statusMap[probeName];
  }

  private checkTerminusHealthResults(
    results: HealthIndicatorResult[],
  ): boolean {
    return results.every(
      (result) => result[Object.keys(result)[0]].status === 'up',
    );
  }
}
