import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, PlotlyModule],
  templateUrl: './home.html',
  styleUrls: ['./home.less']
})
export class Home implements OnInit {
  measureIds: number[] = [];
  selectedId: number | null = null;
  signal: number[] = [];
  time: number[] = [];
  analysis: { dominantFreq: number, dominantAmp: number } | null = null;
  plotData: any[] = [];
  plotLayout: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/signal').subscribe(data => {
      this.measureIds = data.map(row => row.id);
    });
  }

  onSelectMeasure(event: Event): void {
		const selectElement = event.target as HTMLSelectElement;
		const id = Number(selectElement.value);
		
		this.http.get<any>(`http://localhost:3000/api/signal/${id}`).subscribe(data => {
			this.signal = data.signal;
			this.analysis = data.analysis;
			this.selectedId = id;
			this.time = this.signal.map((_, i) => i * 0.01);
			this.plotSignal();
		});
	}

  plotSignal(): void {
    this.plotData = [{
      x: this.time,
      y: this.signal,
      type: 'scatter',
      mode: 'lines',
      name: `Signal ${this.selectedId}`
    }];

    this.plotLayout = {
      title: `Mesure ID: ${this.selectedId} | Dominant Frequency: ${this.analysis?.dominantFreq} Hz | Amplitude: ${this.analysis?.dominantAmp}`,
      xaxis: { title: 'Time (s)', range: [0, 8 / (this.analysis?.dominantFreq || 1)] },
      yaxis: { title: 'Amplitude' }
    };
  }
}
