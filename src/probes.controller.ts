import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PROBE_NOT_OKAY, PROBE_OKAY } from './probes.constants';
import { ProbesService } from './probes.service';
import { ProbeType } from './types';

@Controller('probes')
export class ProbeController {
  constructor(private readonly probesService: ProbesService) {}

  @Get(':probeName')
  public async checkProbe(
    @Param('probeName') probeName: ProbeType,
    @Res() res: Response,
  ) {
    const succeeded = await this.probesService.checkProbe(probeName);
    res
      .status(succeeded ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
      .json({ status: succeeded ? PROBE_OKAY : PROBE_NOT_OKAY });
  }
}
