import { Resource, Get, Before, RouteContext } from "../mod.ts";
import { BaseClass } from "./base.ts";


@Resource("/hello", { version: "v1" })
@Before(() => {
	console.log("Before Hello");
	return Promise.resolve(true);
})
export class Hello extends BaseClass {
	constructor() {
		super();
		console.log("hello");
	}
	@Get("/")
	public async doSome() {
		this.increment();
		return {
			say: this.doSomething(),
			count: this.counter,
		};
	}

	@Get("/world/:param1/:optional?/:notoptional")
	@Before((context) => {
		context.payload = { hello: "world" };

		console.log("Before World");
		return Promise.resolve(true);
	})
	public async world(context: RouteContext) {
		console.log(this.counter, context.params, context.params);
		return {
			context: {
				parsed: context.req.parsed,
				params: {
					notoptional: context.params.get("notoptional"),
					optional: context.params.get("optional?"),
					param1: context.params.get("param1"),
				},
				headers: context.headers,
				method: context.method,
				path: context.req.url,
				payload: context.payload,
				query: context.query,
				version: context.version,

			},
			hello: 1,
			counter: this.counter,
		};
	}
}
