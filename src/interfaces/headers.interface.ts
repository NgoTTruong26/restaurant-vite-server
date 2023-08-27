import { IncomingHttpHeaders } from "http";

export interface IHeadersAdminAuthRequest extends IncomingHttpHeaders {
  admin_authorization?: string;
}
