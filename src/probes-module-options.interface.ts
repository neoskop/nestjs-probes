import { HealthIndicatorFunction } from "@nestjs/terminus";
import { ProbeCheck, ProbeType } from "./types";

export interface ProbesModuleOptions {
  checks: {
    [key in ProbeType]?:
      | ProbeCheck
      | HealthIndicatorFunction
      | HealthIndicatorFunction[];
  };
}
