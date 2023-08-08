import { assertEquals } from "https://deno.land/std@0.197.0/assert/mod.ts";
import { RouteContext, Resource, Hum, Get, Post, app, Before, HttpStatus, regexify, Route, HttpMethodsEnum, Put, Patch, Mixed } from "./mod.ts";

Deno.test("regexify should return correct pattern for static route", () => {
	const { pattern } = regexify("/users");
	assertEquals(pattern.test("/users"), true);
	assertEquals(pattern.test("/users/"), true);
	assertEquals(pattern.test("/users/123"), false);
});

Deno.test("regexify should return correct pattern for route with named parameter", () => {
	const { pattern } = regexify("/users/:id");
	assertEquals(pattern.test("/users/123"), true);
	assertEquals(pattern.test("/users/abc"), true);
	assertEquals(pattern.test("/users/"), false);
});

Deno.test("regexify should return correct pattern for route with optional named parameter", () => {
	const { pattern } = regexify("/users/:id?");
	assertEquals(pattern.test("/users"), true);
	assertEquals(pattern.test("/users/123"), true);
	assertEquals(pattern.test("/users/abc"), true);
	assertEquals(pattern.test("/users/123/"), true);
});

Deno.test("regexify should return correct pattern for route with wildcard parameter", () => {
	const { pattern } = regexify("/users/*");
	assertEquals(pattern.test("/users/"), true);
	assertEquals(pattern.test("/users/123"), true);
	assertEquals(pattern.test("/users/abc"), true);
});


Deno.test("Resource decorator should add routes to the app", () => {
	@Resource("/users")
	@Before(() => {
		return Promise.resolve(true);
	})
	class _UserController {
		@Get("/:id")
		getUser() { }

		@Post("/")
		createUser() { }

		@Put("/:id")
		updateUser() { }

		@Patch("/:id")
		patchUser() { }

		@Mixed("/:id")
		mixedUser() { }
	}

	assertEquals(app.routes.length, 5);
	assertEquals(app.routes[0].method, "GET");
	assertEquals(app.routes[0].path, "/users/:id");
	assertEquals(app.routes[0].name, "getUser");
	assertEquals(app.routes[0].middleware.length, 1);
	assertEquals(app.routes[1].method, "POST");
	assertEquals(app.routes[1].path, "/users/");
	assertEquals(app.routes[1].name, "createUser");
	assertEquals(app.routes[1].middleware.length, 1);
	assertEquals(app.routes[2].method, "PUT");
	assertEquals(app.routes[2].path, "/users/:id");
	assertEquals(app.routes[2].name, "updateUser");
	assertEquals(app.routes[2].middleware.length, 1);
	assertEquals(app.routes[3].method, "PATCH");
	assertEquals(app.routes[3].path, "/users/:id");
	assertEquals(app.routes[3].name, "patchUser");
	assertEquals(app.routes[3].middleware.length, 1);
	assertEquals(app.routes[4].method, "MIXED");
	assertEquals(app.routes[4].path, "/users/:id");
	assertEquals(app.routes[4].name, "mixedUser");
	assertEquals(app.routes[4].middleware.length, 1);
});

Deno.test("Route decorators should add routes to the app", () => {
	class _UserController {
		@Route(HttpMethodsEnum.GET, "/users/:id")
		getUser() { }

		@Route(HttpMethodsEnum.POST, "/users")
		createUser() { }

		@Route(HttpMethodsEnum.PUT, "/users/:id")
		updateUser() { }

		@Route(HttpMethodsEnum.PATCH, "/users/:id")
		patchUser() { }

		@Route(HttpMethodsEnum.MIXED, "/users/:id")
		mixedUser() { }

		@Before()
		middleware() { }
	}

	assertEquals(app.routes.length, 5);
	assertEquals(app.routes[0].method, "GET");
	assertEquals(app.routes[0].path, "/users/:id");
	assertEquals(app.routes[0].name, "getUser");
	assertEquals(app.routes[0].middleware.length, 1);
	assertEquals(app.routes[1].method, "POST");
	assertEquals(app.routes[1].path, "/users/");
	assertEquals(app.routes[1].name, "createUser");
	assertEquals(app.routes[1].middleware.length, 1);
	assertEquals(app.routes[2].method, "PUT");
	assertEquals(app.routes[2].path, "/users/:id");
	assertEquals(app.routes[2].name, "updateUser");
	assertEquals(app.routes[2].middleware.length, 1);
	assertEquals(app.routes[3].method, "PATCH");
	assertEquals(app.routes[3].path, "/users/:id");
	assertEquals(app.routes[3].name, "patchUser");
	assertEquals(app.routes[3].middleware.length, 1);
	assertEquals(app.routes[4].method, "MIXED");
	assertEquals(app.routes[4].path, "/users/:id");
	assertEquals(app.routes[4].name, "mixedUser");
	assertEquals(app.routes[4].middleware.length, 1);
});


Deno.test("Hum:POST", async () => {

	@Resource("/")
	class _PostData {
		@Post("/")
		public async json(context: RouteContext) {
			const json = await context.req.json()
			return {
				code: 200,
				message: json,
			};
		}
	}


	Hum({
		port: 3000,
	});
	const response = await fetch("http://localhost:3000/", {
		method: "POST",
		body: JSON.stringify({ hello: "world" }),
		headers: {
			"Content-Type": "application/json",
		},

	});
	assertEquals(response.status, 200);
	assertEquals(response.headers.get("content-type"), "application/json");
	const json = await response.json();
	assertEquals(json.message.hello, "world");
	app.server?.close();

});



Deno.test("Hum:JSON", async () => {
	@Resource("/json")
	class _TEST_JSON {
		@Get("/")
		public json(context: RouteContext) {
			(context)
			return {
				code: 200,
				message: {
					data: true,
				},
			};
		}
	}

	Hum({
		port: 3000,
	});

	const response = await fetch("http://localhost:3000/json");
	assertEquals(response.status, 200);
	assertEquals(response.headers.get("content-type"), "application/json");
	const json = await response.json();
	assertEquals(json.message.data, true);

	app.server?.close();

});


Deno.test("Hum:POST", async () => {
	@Resource("/")
	class _PostData {
		@Post("/")
		public json(context: RouteContext) {

			return {
				code: 200,
				message: context.req.body,
			};
		}
	}

	Hum({
		port: 3000,
	});

	const response = await fetch("http://localhost:3000/", {
		method: "POST",
		body: JSON.stringify({ hello: "world" }),
		headers: {
			"Content-Type": "application/json",
		},

	});


	assertEquals(response.status, 200);
	assertEquals(response.headers.get("content-type"), "application/json");
	const json = await response.json();
	assertEquals(json.message.hello, "world");

	app.server?.close();

});


Deno.test("Hum:UPLOAD", async () => {

	@Resource("/upload")
	class _Upload {
		@Post("/")
		public async upload(context: RouteContext) {
			const formData = await context.req.formData();

			return {
				code: 200,
				message: {
					name: (formData.get("file") as File).name,
					size: (formData.get("file") as File).size,
				},
			};
		}
	}


	Hum({
		port: 3000,
	});

	const file = new FormData();
	file.append("file", new Blob(["hello world"]), "hello.txt");

	// upload file


	const request = await fetch("http://localhost:3000/upload", {
		method: "POST",
		body: file

	})

	const response = await request?.json()

	assertEquals(request.status, 200);
	assertEquals(request.headers.get("content-type"), "application/json");
	assertEquals(response.message.name, "hello.txt");
	assertEquals(response.message.size, "hello world".length);

	app.server?.close();

});


Deno.test("Hum:QUERY", async () => {
	@Resource()
	class _Test {
		@Get("/querytest")
		public querytest(context: RouteContext) {
			return {
				code: 200,
				message: {
					hello: context.query.get("hello"),
					query: Array.from(context.query.entries()),
					world: context.query.get("world"),
				},
			};
		}
	}
	Hum({
		port: 3000,
	});

	const response = await fetch("http://localhost:3000/querytest?hello=world&world=hello");

	assertEquals(response.status, 200);
	assertEquals(response.headers.get("content-type"), "application/json");

	const json = await response.json();
	(json)

	assertEquals(json?.message.hello, "world");
	assertEquals(json?.message.world, "hello");
	assertEquals(json?.message.query.length, 2);

	app.server?.close();
});

Deno.test("Hum:PARAMS", async () => {
	@Resource()
	class _Test {
		@Get("/paramtest/:hello")
		public paramTest({ params }: RouteContext) {
			return {
				message: {
					hello: params.get("hello"),
					param: {
						hello: params.get("hello"),
					},
				},
			};
		}
	}

	Hum({
		port: 3000,
	});



	const response = await fetch("http://localhost:3000/paramtest/world");


	assertEquals(response.status, 200);
	assertEquals(response.headers.get("content-type"), "application/json");

	const json = await response.json();
	(json)
	assertEquals(json.message.hello, "world");
	assertEquals(json.message.param.hello, "world");

	app.server?.close();
});

Deno.test("Hum:OPTIONAL_PARAMS", async () => {
	@Resource()
	class _Test {
		@Get("/paramtest/:first/:second?/:third/:fourth?")
		public paramTest(context: RouteContext) {
			return {
				message: {
					first: context.params.get("first"),
					second: context.params.get("second?"),
					third: context.params.get("third"),
					fourth: context.params.get("fourth?"),
				},
			};
		}
	}


	Hum({
		port: 3000,
	});

	const request = await fetch("http://localhost:3000/paramtest/1/2/3/6337515156058800");

	const response = await request.json();

	assertEquals(request.status, 200);
	assertEquals(response.message.first, 1);
	assertEquals(response.message.second, 2);
	assertEquals(response.message.third, 3);
	assertEquals(response.message.fourth.toString(), "6337515156058800");

	const request2 = await fetch("http://localhost:3000/paramtest/1/3");
	const response2 = await request2.json();

	assertEquals(request2.status, 200);
	assertEquals(response2.message.first, 1);
	assertEquals(response2.message.second, undefined);
	assertEquals(response2.message.third, 3);


	app.server?.close();
});

Deno.test("Hum:MIDDLEWARE_PARAMS", async () => {
	const getNumber = (context: RouteContext) => {
		context.url.pathname = context.url.pathname.replace("/test", "");
		context.params.set("number", parseInt(context.params.get("number") as string, 10));
		context.test = true;
		return true;
	};

	@Resource("/test")
	class _Test {
		@Get("/html/:number")
		@Before(getNumber)
		public html(context: RouteContext) {
			assertEquals(context.params.get("number"), 10);
			assertEquals(context.test, true);

			context.headers.set("Content-type", "text/html");
			context.status = HttpStatus.I_AM_A_TEAPOT;

			return "<h1>Hello<h1>";
		}
	}

	Hum({
		port: 3000,
	});


	const request = await fetch("http://localhost:3000/test/html/10");

	const response = await request.text();
	assertEquals(request.status, 418);

	assertEquals(request.headers.get("content-type"), "text/html");


	assertEquals(response, "<h1>Hello<h1>");

	app.server?.close();


});
