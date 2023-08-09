# Hum

Simple, lightweight HTTP routing framework

### Basic Example

```typescript
import { app, Get, Hum, Resource } from "https://deno.land/x/hum@v0.0.4/mod.ts";";

@Resource()
export class Hello {
  @Get("/hello")
  public async index() {
    return {
      hello: "world",
    };
  }
}

Hum({
  port: 3000,
});
```
