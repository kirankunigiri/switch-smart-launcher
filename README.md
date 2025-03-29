# switch-smart-launcher
A smarter app launcher for the Nintendo Switch. Built with nx.js

![Smart Launcher](https://i.imgur.com/JWaeQ2z.jpeg)


### Dev
```bash
bun i
bun run dev # run locally in the browser
bun run build # creates an nro file you can install on your switch
```

### Features Implemented
- Tap to launch
- Basic scrolling/navigation with d-pad
- Fetching metadata from eshop API

### Goals
- Display metadata over app tiles (# of players, category, etc.)
- Sorting + filtering by the that metadata

### Issues
- Rendering is really slow on Switch, simple button inputs are slow to register
- Rendering images on screen causes memory issues, app crashes after some time
- Loading metadata from eshop api crashes the app