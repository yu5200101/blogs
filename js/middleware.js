const app = {
    middleware: [],
    callback(ctx) {
      // 4
        console.log(ctx, 999999);
    },
    use(fn) {
        this.middleware.push(fn)
    },
    go(ctx) {
      const dispatch = (i) => {
        if (i === this.middleware.length) {
          this.callback(ctx)
          return
        }
        const middleware = this.middleware[i]
        middleware(ctx, () => dispatch(i + 1))
      }
      dispatch(0)
    }
}

app.use((ctx, next) => {
    // 1
    console.log("第一");
    ctx.name = 'Lucy';
    next();
    // 6
    console.log("第一一");
})

app.use((ctx, next) => {
    // 2
    console.log("第二");
    ctx.age = 12;
    next();
    // 5
    console.log("第二二");
})

app.use((ctx, next) => {
    // 3
    console.log(`${ctx.name} is ${ctx.age} years old. ${ctx.num}`) // => Lucy is 12 years old.
    next();
})

// ... 任意调用 use 插入中间件
app.go({ num: "leon" });