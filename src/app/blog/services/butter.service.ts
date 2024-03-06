import Butter from 'buttercms';
import { environment } from '../../../environments/environment';

export const ButterService = Butter(environment.butterCMSKey);
