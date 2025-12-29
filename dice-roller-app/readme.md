a parent container
children should be aligned center

label 
input number and button roll

a grid with 3 cols
dice : each have a box 
        A dice is a div with 3*3 matrix
        1 -> [1,1] and rest 0
        2 -> [0,2]  [2,0] and rest 0
        3 -> [0,2], [2,0], [1,1] and rest 0
        4 -> [0,0], [0,2], [2,0], [2,2] and rest 0
        5 -> [0,0], [0,2], [2,0], [2,2], [1,1] and rest 0
        6 -> [0,0] [1,0], [2,0], [0,2], [1,2] [2,2]  and rest 0


        


## Random Number Generation

```javascript
// Generate random number between 1 and 6
Math.floor(Math.random() * 6) + 1
```

### How it works:

1. **`Math.random()`** → Returns `[0, 1)` (0 inclusive, 1 exclusive)
2. **`* 6`** → Scales to `[0, 6)` 
3. **`Math.floor()`** → Rounds down to integers `[0, 5]`
4. **`+ 1`** → Shifts range to `[1, 6]`



Math.random()        → [0.0, 0.1, 0.2, ..., 0.9, 0.99...]
× 6                  → [0.0, 0.6, 1.2, ..., 5.4, 5.99...]
Math.floor()         → [0,   0,   1,   ..., 5,   5]
+ 1                  → [1,   1,   2,   ..., 6,   6]
**Result:** Random integer from 1 to 6 (inclusive)


This is the standard way to generate random integers in a range [min, max]:
 Math.floor(Math.random() * (max - min + 1)) + min



 ## Small learnings
 Input has a border, when set it looks good, order radius as well
 Font-size for input makes it big/small. 
 padding works
set a max-width for input is good idea

labels should have a font-size: 1rem; font-weight: 500; and color


align-items: center; and justify-content: center works only if it is display:grid

## 
--------
##

### Points to know for flexbox styling
Know that some UI elements should have fixed max width, example inputs, buttons etc
So the design becomes simpler 
example we can give flex: 0 0 calc(33.333% - 14px); if parent has fixed max width 

-   aspect-ratio: 1/1;
works with atleast one of height and width
  height: 80px;

 
 

 ----
 Breaking Down flex: 0 0 calc(33.333% - 14px)
flex: 0 0 calc(33.333% - 14px);
This means:
0 (flex-grow): The item won't grow beyond its basis
0 (flex-shrink): The item won't shrink below its basis
calc(33.333% - 14px) (flex-basis): The initial width is 33.333% of the container minus 14px
Why 33.333%?
100% ÷ 3 = 33.333% per column
Why Subtract 14px?
With gap: 20px between items, each item has gaps on both sides. To fit three items:
2 gaps between 3 items = 2 × 20px = 40px total
Per item: 40px ÷ 3 ≈ 13.33px
Using 14px (or a similar value) accounts for the gap space
