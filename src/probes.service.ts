import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { ProbesModuleOptions } from './probes-module-options.interface';
import { ProbeType } from './types';

@Injectable()
export class ProbesService {
  private statusMap: Map<ProbeType, boolean>;

  constructor(private readonly options: ProbesModuleOptions) {}

  public async checkProbe(probeName: ProbeType): Promise<boolean> {
    if (!this.statusMap.has(probeName) && this.statusMap[probeName]) {
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
          const results = await Promise.all(check.map(f => f()));
          this.checkTerminusHealthResults(results);
        }

        this.statusMap[probeName] = newStatus;
      } else {
        this.statusMap[probeName] = true;
      }
    }

    return this.statusMap[probeName];
  }

  private checkTerminusHealthResults(
    results: HealthIndicatorResult[],
  ): boolean {
    return results.every(
      result => result[Object.keys(result)[0]].status !== 'up',
    );
  }
}
