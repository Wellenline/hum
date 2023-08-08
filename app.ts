import { Errors } from "./routes/error.ts";
import { Hello } from "./routes/hello.ts";
import { Query } from "./routes/query.ts";
import { Redirect } from "./routes/redirect.ts";
import { V2 } from "./routes/v2/v2.ts";
import { World } from "./routes/world.ts";
import { Hum, app, RouteContext } from "./mod.ts";
import { Index } from "./routes/index.ts";
import { TEST_JSON } from "./routes/json.ts";


Hum({
	resources: [Hello, TEST_JSON, Errors, World, Query, Redirect, V2, Index] as any,
	middleware: [(ctx: RouteContext) => {
		ctx.headers.set("X-Powered-By", "VIA");
		ctx.headers.set("Set-Cookie", "token=219ffwef9w0f; Domain=localhost; secure=true; HttpOnly=true; SameSite=Strict; Path=/; Expires=Wed, 21 Oct 2020 07:28:00 GMT; Max-Age=3600;");
		console.log("Global Middleware", Object.fromEntries(ctx.headers.entries()));

		return Promise.resolve(true);
	}],
	logs: true,
	port: 3000,
});
