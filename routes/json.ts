import { Resource, Get, RouteContext, } from "../mod.ts";

@Resource("/json")
export class TEST_JSON {
	@Get("/")
	public json(context: RouteContext) {
		return {
			code: 200,
			message: {
				data: true,
			},
		};
	}
}