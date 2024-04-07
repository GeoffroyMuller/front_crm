import { Model } from "objection";


export enum SmtpDistributor {
  mailjet = 1,
}

export default class Configuration extends Model {
  id?: number;
  idAuth?: number;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_host?: string;

  smtp_distributor?: SmtpDistributor;

  static get tableName() {
    return "configuration";
  }

  static get relationMappings() {
    return {}
  }

  get host(): string {
    if (this.smtp_host) return this.smtp_host;
    if (this.smtp_distributor === SmtpDistributor.mailjet) return ''
    return '';
  }
}
