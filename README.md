# keksbot image-renderer
API für keksbot battles  

```js
GET /api/r?users
  users: {
    [key: string (name)]: boolean (ready)
  }
```
```js
GET /api/b?users
  users: {
    n: string (name),
    l: int (level),
    h: int (hp),
    m: int (max hp),
    t: int (team)
  }
```
