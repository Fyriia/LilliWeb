import {AfterViewInit, Component, ElementRef, OnInit, output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-graph-app',
  standalone: true,
  imports: [],
  templateUrl: './graph-app.component.html',
  styleUrl: './graph-app.component.scss'
})
export class GraphAppComponent implements OnInit, AfterViewInit {

  @ViewChild('graphCanvas', { static: true }) graphCanvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  originalMatrix = {
    values: [] as number[][],
    nodes: [] as { label: number; x: number; y: number }[],
    nodeCounter: 1
  };

  currentlyDrawing = false;
  originIndex: number | false = false;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.context = this.graphCanvas.nativeElement.getContext('2d')!;
    const uploadInput = document.getElementById('upload-input') as HTMLInputElement;
    const matrizenButton = document.getElementById('matrizenButton');
    const matrizenDiv = document.getElementById('matrizen');

    uploadInput.addEventListener('change', (e) => this.acceptFile(e));
    this.graphCanvas.nativeElement.addEventListener('click', (event) => this.handleCanvasClick(event));
    matrizenButton?.addEventListener('click', () => { matrizenDiv?.classList.toggle('hidden') });
  }

  isItOnANode(event: MouseEvent): number | any {
    const rect = this.graphCanvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    let index: any = false;
    for (let i = 0; i < this.originalMatrix.nodes.length; i++) {
      if ((mouseX <= this.originalMatrix.nodes[i].x + 19 && mouseX >= this.originalMatrix.nodes[i].x - 19) &&
        (mouseY <= this.originalMatrix.nodes[i].y + 19 && mouseY >= this.originalMatrix.nodes[i].y - 19)) {
        index = i;
      }
    }
    return index;
  }

  handleCanvasClick(event: MouseEvent) {
    const index = this.isItOnANode(event);
    if (index !== false && !this.currentlyDrawing) {
      this.addEdge(event);
    } else if (this.currentlyDrawing && index !== false) {
      this.continueEdge(event);
    } else {
      this.addNode(event);
    }
  }

  addNode(event: MouseEvent) {
    const rect = this.graphCanvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.originalMatrix.values.forEach(row => row.push(0));
    let newNode = new Array(this.originalMatrix.values.length + 1).fill(0);
    this.originalMatrix.values.push(newNode);
    this.originalMatrix.nodes.push({ label: this.originalMatrix.nodeCounter++, x: mouseX, y: mouseY });
    this.translateMatrix(this.originalMatrix);
  }

  addEdge(event: MouseEvent) {
    this.currentlyDrawing = true;
    this.originIndex = this.isItOnANode(event);
    if (this.originIndex !== false) {
      this.context.beginPath();
      this.context.arc(this.originalMatrix.nodes[this.originIndex].x, this.originalMatrix.nodes[this.originIndex].y, 16, 0, Math.PI * 2, true);
      this.context.fillStyle = '#ED5CF3';
      this.context.fill();
      this.context.stroke();
      this.context.fillStyle = 'white';
      this.context.font = '14px Arial';
      this.context.fillText(this.toLetters(this.originalMatrix.nodes[this.originIndex].label), this.originalMatrix.nodes[this.originIndex].x - 5, this.originalMatrix.nodes[this.originIndex].y + 5);
    }
  }

  continueEdge(event: MouseEvent) {
    let destinationIndex = this.isItOnANode(event);
    if (this.currentlyDrawing && this.originIndex !== false && destinationIndex !== false) {
      this.originalMatrix.values[this.originIndex][destinationIndex] = 1;
      this.originalMatrix.values[destinationIndex][this.originIndex] = 1;
      this.translateMatrix(this.originalMatrix);
    }
    this.currentlyDrawing = false;
    this.originIndex = false;
  }

  acceptFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      this.refresh();
      this.translateMatrix(this.createNodes(this.matrixArray(content)));
    };
    reader.readAsText(file);
  }

  refresh() {
    this.originalMatrix = {
      values: [],
      nodes: [],
      nodeCounter: 1
    };
    const outputDiv = document.getElementById('output');
    const matrizenDiv = document.getElementById('matrizen');
    if (outputDiv) outputDiv.innerHTML = '';
    if (matrizenDiv) matrizenDiv.innerHTML = '';
  }

  matrixArray(content: string) {
    const lines = content.trim().split('\n');
    const numColumns = lines[0].split(';').length;
    const columns = Array.from({ length: numColumns }, () => [] as number[]);

    lines.forEach(line => {
      const values = line.trim().split(';').map(val => parseInt(val));
      values.forEach((value, index) => columns[index].push(value));
    });

    for (let i = 0; i < columns.length; i++) {
      this.originalMatrix.values[i] = columns[i];
    }
    return this.originalMatrix;
  }

  displayMatrix(matrix: any) {
    if (!matrix || !matrix.values || matrix.values.length === 0 || !matrix.values[0]) {
      throw new Error('Matrix data is invalid.');
    }

    const table = document.createElement('table');
    matrix.values.forEach((rowValues: number[]) => {
      const row = document.createElement('tr');
      rowValues.forEach(cellValue => {
        const cell = document.createElement('td');
        cell.textContent = cellValue + ';';
        row.appendChild(cell);
      });
      table.appendChild(row);
    });
    document.getElementById('matrizen')?.appendChild(table);
  }

  toLetters(num: number): string {
    let mod = num % 26;
    let pow = Math.floor(num / 26);
    let out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? this.toLetters(pow) + out : out;
  }

  add(m1: any, m2: any) {
    if (!m1 || !m2) {
      throw new Error('Invalid matrices provided.');
    }
    let m3 = { values: [] as number[][] };
    for (let i = 0; i < m1.values.length; i++) {
      let result = [];
      for (let j = 0; j < m1.values[i].length; j++) {
        result.push(m1.values[i][j] + m2.values[i][j]);
      }
      m3.values.push(result);
    }
    return m3;
  }

  multiply(m1: any, m2: any) {
    if (!m1 || !m2) {
      throw new Error('Invalid matrices provided.');
    }

    const columns = m1.values.length;
    const rows = m1.values[0].length;
    let m3 = { values: [] as number[][] };

    for (let i = 0; i < columns; i++) {
      m3.values[i] = [];
      for (let j = 0; j < rows; j++) {
        let sum = 0;
        for (let k = 0; k < rows; k++) {
          sum += m1.values[i][k] * m2.values[k][j];
        }
        m3.values[i][j] = sum;
      }
    }
    return m3;
  }

  initializeDistanzmatrix(m1: any) {
    let distanzmatrix = { values: [] as any[][] };
    for (let i = 0; i < m1.values.length; i++) {
      distanzmatrix.values[i] = [...m1.values[i]];
    }
    for (let i = 0; i < distanzmatrix.values.length; i++) {
      distanzmatrix.values[i][i] = ' . ';
    }
    distanzmatrix.values.forEach(row => row.forEach((value, index) => {
      if (value === 0) row[index] = '∞';
    }));
    for (let i = 0; i < distanzmatrix.values.length; i++) {
      distanzmatrix.values[i][i] = 0;
    }
    return distanzmatrix;
  }

  calculateDistances(m1: any) {
    let distanzmatrix = this.initializeDistanzmatrix(m1);
    let prevResult = m1;
    for (let i = 2; i <= m1.values.length + 1; i++) {
      let currentResult = this.multiply(m1, prevResult);
      prevResult = currentResult;

      for (let j = 0; j < distanzmatrix.values.length; j++) {
        for (let k = 0; k < distanzmatrix.values[j].length; k++) {
          if (distanzmatrix.values[j][k] === '∞' && currentResult.values[j][k] !== 0) {
            distanzmatrix.values[j][k] = i;
          }
        }
      }
    }
    return distanzmatrix;
  }

  eccentricityCalc(m1: any) {
    const outputDiv = document.getElementById('output'); // Make sure you target the correct div
    if (outputDiv) {
      // Clear all existing <p> elements inside the output div
      outputDiv.innerHTML = '';
    }

    let newMatrix = this.calculateDistances(m1);
    let eccentricities: any[] = [];

    let graphDisconnected = false; // Flag to check if the graph is disconnected
    newMatrix.values.forEach((row: any) => {
      if (row.includes('∞')) {
        graphDisconnected = true;
      }
    });

    if (graphDisconnected) {
      const p = document.createElement('p');
      p.textContent = 'Graph ist nicht zusammenhängend.';
      outputDiv?.appendChild(p);
      return; // Exit the function early since the graph is disconnected
    }

    newMatrix.values.forEach((row: any, i: number) => {
      let counter = Math.max(...row.filter((val: any) => val !== '∞'));
      eccentricities[i] = [i, counter];
    });

    m1.eccentricities = eccentricities;
    let durchmesser = Math.max(...eccentricities.map(e => e[1]));
    let radius = Math.min(...eccentricities.map(e => e[1]));
    let zentrum = eccentricities.filter(e => e[1] === radius).map(e => this.toLetters(e[0] + 1)).join(', ');

    const p2 = document.createElement('p');
    p2.innerHTML = `Der Durchmesser dieses Graphs beträgt <strong>${durchmesser}</strong>, der Radius beträgt <strong>${radius}</strong> und das Zentrum/die Zentren ist/sind <strong>${zentrum}</strong>.`;

    outputDiv?.appendChild(p2);
  }

  initializeWegmatrix(m: any) {
    if (!m) {
      throw new Error('Übergebene Matrix ist null.');
    }
    let wegmatrix = { values: [] as number[][] };
    let numColumns = m.values.length;
    for (let i = 0; i < numColumns; i++) {
      let column = Array(numColumns).fill(0);
      column[i] = 1;
      wegmatrix.values.push(column);
    }

    for (let i = 0; i < m.values.length; i++) {
      for (let j = 0; j < m.values[i].length; j++) {
        if (m.values[i][j] > 0) {
          wegmatrix.values[i][j] = 1;
        }
      }
    }

    let prevResult = JSON.parse(JSON.stringify(m));
    for (let i = 2; i <= m.values.length + 1; i++) {
      let currentResult = this.multiply(m, prevResult);
      prevResult = currentResult;

      for (let j = 0; j < wegmatrix.values.length; j++) {
        for (let k = 0; k < wegmatrix.values[j].length; k++) {
          if (wegmatrix.values[j][k] === 0 && currentResult.values[j][k] > 0) {
            wegmatrix.values[j][k] = 1;
          }
        }
      }
    }
    return wegmatrix;
  }

  calcComponents(m: any) {
    let wegmatrix = this.initializeWegmatrix(m);
    let uniqueRows = new Set(wegmatrix.values.map((row: any) => JSON.stringify(row)));
    return uniqueRows.size;
  }

  calcArticulations(m: any) {
    let baseCount = this.calcComponents(m);
    let articulations: string[] = [];

    for (let i = 0; i < m.values.length; i++) {
      let mCopy = JSON.parse(JSON.stringify(m));
      mCopy.values.splice(i, 1);
      mCopy.values.forEach((row: any) => row.splice(i, 1));

      if (this.calcComponents(mCopy) > baseCount) {
        articulations.push(this.toLetters(i + 1));
      }
    }

    const p = document.createElement('p');
    p.innerHTML = `Die Artikulation/en in diesem Graphen ist/sind <strong>${articulations.join(', ')}</strong>.`;
    if (articulations.length === 0) {
      p.textContent = 'Dieser Graph enthält keine Artikulationen.';
    }
    document.getElementById('output')?.appendChild(p);

    return articulations;
  }

  calcBridges(m: any) {
    let baseCount = this.calcComponents(m);
    let mCopy = JSON.parse(JSON.stringify(m));
    let bridges: string[] = [];

    for (let i = 0; i < mCopy.values.length; i++) {
      for (let j = i + 1; j < mCopy.values[i].length; j++) {
        if (mCopy.values[i][j] === 1) {
          mCopy.values[i][j] = 0;
          mCopy.values[j][i] = 0;
          if (this.calcComponents(mCopy) > baseCount) {
            bridges.push(`${this.toLetters(i + 1)} und ${this.toLetters(j + 1)}`);
          }
          mCopy.values[i][j] = 1;
          mCopy.values[j][i] = 1;
        }
      }
    }

    const p = document.createElement('p');
    p.innerHTML = `Die Brücke/n in diesem Graphen ist/sind zwischen <strong>${bridges.join(', ')}</strong>.`;
    if (bridges.length === 0) {
      p.textContent = 'Dieser Graph enthält keine Brücken.';
    }
    document.getElementById('output')?.appendChild(p);
    return bridges;
  }

  getRandom(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  createNodes(m: any) {
    m.nodeCounter = 1;
    const nodes = [];
    for (let i = 1; i <= m.values.length; i++) {
      let node = {
        label: m.nodeCounter++,
        x: this.getRandom(-this.graphCanvas.nativeElement.width / 2.5, this.graphCanvas.nativeElement.width / 2.5) + this.graphCanvas.nativeElement.width / 2,
        y: this.getRandom(-this.graphCanvas.nativeElement.height / 2.5, this.graphCanvas.nativeElement.height / 2.5) + this.graphCanvas.nativeElement.height / 2
      };
      nodes.push(node);
    }

    m.nodes = nodes;
    for (let i = 0; i < 100; i++) {
      this.updateNodePositions(m);
    }

    return m;
  }

  updateNodePositions(m: any) {
    for (let i = 0; i < m.nodes.length; i++) {
      for (let j = 0; j < m.nodes.length; j++) {
        if (Math.abs(m.nodes[i].x - m.nodes[j].x) < 19 && Math.abs(m.nodes[i].y - m.nodes[j].y) < 19) {
          m.nodes[i].x = this.getRandom(-this.graphCanvas.nativeElement.width / 2.3, this.graphCanvas.nativeElement.width / 2.3) + this.graphCanvas.nativeElement.width / 2;
          m.nodes[i].y = this.getRandom(-this.graphCanvas.nativeElement.height / 2.5, this.graphCanvas.nativeElement.height / 2.5) + this.graphCanvas.nativeElement.height / 2;
        }
      }
    }
  }

  translateMatrix(m: any) {
    const outputDiv = document.getElementById('output');
    this.context.clearRect(0, 0, this.graphCanvas.nativeElement.width, this.graphCanvas.nativeElement.height);
    this.context.strokeStyle = '#424FD2';

    for (let i = 0; i < m.values.length; i++) {
      for (let j = i + 1; j < m.values[i].length; j++) {
        if (m.values[i][j] === 1) {
          this.context.beginPath();
          this.context.moveTo(m.nodes[i].x, m.nodes[i].y);
          this.context.lineTo(m.nodes[j].x, m.nodes[j].y);
          this.context.stroke();
        }
      }
    }

    m.nodes.forEach((node: any) => {
      this.context.beginPath();
      this.context.arc(node.x, node.y, 16, 0, Math.PI * 2, true);
      this.context.fillStyle = '#424FD2';
      this.context.fill();
      this.context.stroke();
      this.context.fillStyle = 'white';
      this.context.font = '14px Arial';
      this.context.fillText(this.toLetters(node.label), node.x - 5, node.y + 5);
    });
    this.calcEverything(m);
  }

  calcEverything(m: any) {
    const outputDiv = document.getElementById('output');
    const matrizenDiv = document.getElementById('matrizen');
    if (outputDiv) outputDiv.innerHTML = '';
    if (matrizenDiv) matrizenDiv.innerHTML = '';

    this.eccentricityCalc(m);
    this.calcComponents(m);
    this.calcArticulations(m);
    this.calcBridges(m);
    this.displayMatrix(this.originalMatrix);
    this.displayMatrix(this.calculateDistances(this.originalMatrix));
  }
}
