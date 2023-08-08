import { Resource, Get, RouteContext, HttpStatus, } from "../mod.ts";

@Resource("/redirect", { version: "v1" })
export class Redirect {

	@Get("/")
	public async world(context: RouteContext) {
		context.redirect = "https://google.com";
		context.status = HttpStatus.FOUND;
	}
}
