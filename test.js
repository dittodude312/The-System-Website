new Promise((resolve, reject) => {
    const arr = [1,2,3,4]
    const thing = arr.filter(element => {
        element == 2;
    })
    console.log(thing)
    resolve("hello")
}).then(value => console.log(value))