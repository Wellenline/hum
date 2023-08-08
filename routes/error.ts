import { Resource, Get, HttpException, RouteContext, HttpStatus } from "../mod.ts";

declare const o: any;
@Resource("/errors")
export class Errors {

	@Get("/")
	public async error() {
		throw new HttpException("Teapot", HttpStatus.I_AM_A_TEAPOT);
	}

	@Get("/headers")
	public async headers(context: RouteContext) {
		throw new HttpException("Custom error", HttpStatus.INTERNAL_SERVER_ERROR, {
			"X-Custom-Header": "Custom Value",
		});
	}

	@Get("/header")
	public async header(context: RouteContext) {
		throw new HttpException("Custom error updated", HttpStatus.INTERNAL_SERVER_ERROR, {
			"X-Custom-Header": "Custom Value Updated",
		});
	}

	@Get("/unhandled")
	public async unhandled(context: RouteContext) {
		o.p = 1;
		return "unhandled";
	}
}
