# Hum

Simple, lightwieght & dependency free HTTP routing framework

### Basic Example

```typescript
import { app, Get, Hum, Resource } from "https://deno.land/x/Hum@0.1.0/mod.ts";

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
