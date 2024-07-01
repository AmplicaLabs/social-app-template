import { Express, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { HttpStatusCode } from 'axios';
import { Components } from '../types/openapi';
import { AccountService } from '../services/AccountService';

type Profile = Components.Schemas.Profile;

export class ProfilesController extends BaseController {
  constructor(app: Express) {
    super(app, '/profiles');
  }

  protected initializeRoutes(): void {
    this.router.get('/:msaId', this.getProfile.bind(this));
    this.router.put('/:msaId', this.putProfile.bind(this));
  }

  public async getProfile(_req: Request, res: Response) {
    const profile: Partial<Profile> = {
      fromId: _req.params.msaId,
    };
    // Use account service to get display handle
    const { displayHandle } = await AccountService.getInstance().then((service) =>
      service.getAccount(_req.params.msaId)
    );
    profile.displayHandle = displayHandle;
    return res.status(HttpStatusCode.Ok).send(profile);
  }

  public putProfile(_res: Request, res: Response) {
    return res.status(HttpStatusCode.Accepted).send();
  }
}
