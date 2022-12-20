# rcsb-charts

RCSB PDB Charts is the charting library to display histograms on RCSB.org. It defines an abstraction layer between data and charting libraries. 
Currently, ony a Victory based implementation is available.

### Node Module Installation
`npm install @rcsb/rcsb-charts`

### CDN JavaScript
`<script src="https://cdn.jsdelivr.net/npm/@rcsb/rcsb-charts/build/dist/charts.js" type="text/javascript"></script>`

### Testing 
Different testing examples are available in the `src/RcsbChartExamples` folder
- `npm install`
- `npm run devServer`

Go to:

- `http://localhost:9000/SingleBars.html`
- `http://localhost:9000/SingleHistogram.html`
- `http://localhost:9000/StackHistogram.html`


### JavaScript Examples
- TODO

### Library Documentation
TypeScript classes documentation can be found [here](https://rcsb.github.io/rcsb-charts/)


### Interfaces 
```typescript
interface ChartInterface {
    data: ChartObjectInterface[][];
    dataProvider: ChartDataProviderInterface;
    chartComponentImplementation: AbstractChartImplementationType;
    chartConfig?:ChartConfigInterface;
}
```

```typescript
interface ChartObjectInterface {
    label: string|number;
    population: number;
    objectConfig?:{
        objectId?:string;
        color?:string;
    };
}
```

```typescript
interface ChartDataProviderInterface extends ChartDataReaderInterface {
    setData(data: ChartObjectInterface[][],  config: ChartConfigInterface): void;
}

interface ChartDataReaderInterface {
    getChartData(): {data: ChartDataInterface[]; excludedData?:ChartDataInterface[]}
    xDomain(): [number, number] | undefined;
    tickValues(): string[] | number[] | undefined
}
```

```typescript
interface AbstractChartImplementationInterface {
    height: number;
    width: number;
    dataProvider: ChartDataReaderInterface;
    chartConfig?: ChartConfigInterface;
}
```

### React Classes
- Abstraction layer
  - `ChartComponent<ChartInterface>` 
- Implementation layer
  - `VictoryBarChartComponent`
  - `VictoryHistogramChartComponent`


Contributing
---
All contributions are welcome. Please, make a pull request or open an issue.

License
---

The MIT License

    Copyright (c) 2019 - now, RCSB PDB and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
