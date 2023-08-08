import { Resource, Get, RouteContext, } from "../mod.ts";

@Resource("/world")
export class World {
	@Get("/")
	public hello() {
		return "world";
	}

	@Get("/wild/*")
	public wild() {
		return "Im wild";
	}

	@Get("/:param1/:optional?/:notoptional")
	public parameters(context: RouteContext) {

		/*context.headers = {
			"X-Param1": context.params.param1,
			"X-Optional": context.params.optional,
			"X-NotOptional": context.params.notoptional,
		};*/

		context.headers.set("X-Param1", context.params.get("param1") as string);

		return {
			aaa: "aaa",
			params: Object.fromEntries(context.params.entries()),
			headers: {
				powered: context.headers.get("x-powered-by"),
				param1: context.headers.get("x-param1"),
				cookie: context.headers.getSetCookie(),
			},
			a: Array.from(context.params.entries()),
			param1: context.params.get("param1"),
			optional: context.params.get("optional?"),
			notoptiona: context.params.get("notoptional"),
		};
	}


}

//([\/][^/]+)?