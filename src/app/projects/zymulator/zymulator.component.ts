import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zymulator',
  templateUrl: './zymulator.component.html',
  standalone: true,
  styleUrls: ['./zymulator.component.scss']
})
export class ZymulatorComponent implements OnInit {

  zym = {
    stages: ['begging', 'default', 'default2', 'happy', 'sad'],
    thirstScale: 10,
    hungerScale: 10,
    coldnessScale: 50,
    thirsty: false,
    hungry: false,
    cold: false,
  };

  weather: any = {};
  currentLocation = { lat: '', long: '' };
  apiKey = 'd2ae4acd2e95caad80c781a00fbe3a7c';

  ngOnInit() {
    this.init();
    this.setupDragAndDrop();
    setTimeout(() => this.triggerNeed(), 5000);
  }

  setupDragAndDrop() {
    const dropTarget = document.getElementById('target');

    document.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    dropTarget?.addEventListener('drop', (event) => {
      event.preventDefault();
      const data = event.dataTransfer?.getData('text/plain');
      const draggableElement = document.getElementById(data!);
      this.handleDrop(draggableElement!);
    });

    const items = ['fire', 'water', 'food'].map(id => document.getElementById(id));
    items.forEach(item => {
      item?.addEventListener('dragstart', (event) => {
        const target = event.target as HTMLElement;
        event.dataTransfer?.setData('text/plain', target.id);
      });
    });
  }

  handleDrop(utility: HTMLElement) {
    if (utility.id === 'fire' && this.zym.cold) {
      this.zym.cold = false;
      this.update();
    }

    if (utility.id === 'food' && this.zym.hungry) {
      this.zym.hungry = false;
      this.update();
    }
    if (utility.id === 'water' && this.zym.thirsty) {
      this.zym.thirsty = false;
      this.update();
    }
  }

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentLocation.lat = position.coords.latitude.toString();
            this.currentLocation.long = position.coords.longitude.toString();
            console.log(this.currentLocation);
            resolve(this.currentLocation);
          },
          (error) => {
            console.error('Couldn\'t retrieve location information.');
          }
        );
      } else {
        reject(console.error('Geolocation is not supported by this browser.'));
      }
    });
  }

  async fetchWeather() {
    try {
      await this.getCurrentLocation();
    } catch (error) {
      if (!this.currentLocation.lat || !this.currentLocation.long) {
        this.currentLocation.lat = '48.18565863388932';
        this.currentLocation.long = '16.356703182031964';
      }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.currentLocation.lat}&lon=${this.currentLocation.long}&appid=${this.apiKey}&units=metric`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
      }
      this.weather = await response.json();
      console.log(this.weather);
    } catch (err) {
      console.error('Error fetching weather data:', err);
    }
  }

  async init() {
    await this.fetchWeather();

    const weatherId = this.weather.weather[0].id;
    let currentTemp = this.weather.main.temp;
    let weatherStation = this.weather.name;
    let currentSitch = this.weather.weather[0].main;

    const $weatherDisplay = document.getElementById('weather-display');
    $weatherDisplay!.innerHTML = `<p class="display-text">${currentTemp}°C <br>
                                ${currentSitch}<br>
                                Data from:<br>${weatherStation}</p>`;
    if (currentTemp <= 10) {
      $weatherDisplay!.innerHTML = `<p class="display-text"><span class="cold">${currentTemp}°C</span> <br>
                                ${currentSitch}<br>
                                Data from:<br>${weatherStation}</p>`;
    } else if (currentTemp <= 26) {
      $weatherDisplay!.innerHTML = `<p class="display-text"><span class="medium">${currentTemp}°C</span> <br>
                                ${currentSitch}<br>
                                Data from:<br>${weatherStation}</p>`;
    } else {
      $weatherDisplay!.innerHTML = `<p class="display-text"><span class="hot">${currentTemp}°C</span> <br>
                                ${currentSitch}<br>
                                Data from:<br>${weatherStation}</p>`;
    }

    this.zym.coldnessScale = 50;
    this.zym.hungerScale = 10;
    this.zym.thirstScale = 10;
    this.hideElementsByClassName('drops');
    this.hideElementsByClassName('cloud');
    this.hideElementsByClassName('flakes');
    document.getElementById('dimmer')?.classList.add('hidden');

    if (weatherId > 199 && weatherId < 600) {
      this.showElementsByClassName('drops');
      this.showElementsByClassName('cloud');
      document.getElementById('dimmer')?.classList.remove('hidden');
      this.zym.coldnessScale = 5;
    } else if (weatherId > 599 && weatherId < 700) {
      this.showElementsByClassName('flakes');
      this.showElementsByClassName('cloud');
      document.getElementById('dimmer')?.classList.remove('hidden');
      this.zym.coldnessScale = 5;
    } else if ((weatherId > 700 && weatherId < 800) || weatherId > 800) {
      this.showElementsByClassName('cloud');
      this.zym.hungerScale = 5;
      document.getElementById('dimmer')?.classList.remove('hidden');
    } else if (weatherId === 800) {
      this.zym.thirstScale = 5;
    }
  }

  getRandomInterval(scale: number) {
    return Math.floor(Math.random() * scale * 1000 + scale * 1000);
  }

  weightedRandomSelect() {
    const inverseThirstScale = 1 / this.zym.thirstScale;
    const inverseHungerScale = 1 / this.zym.hungerScale;
    const inverseColdnessScale = 1 / this.zym.coldnessScale;

    const totalInverseScale = inverseThirstScale + inverseHungerScale + inverseColdnessScale;
    const rand = Math.random() * totalInverseScale;

    if (rand < inverseThirstScale) {
      return 'thirsty';
    } else if (rand < inverseThirstScale + inverseHungerScale) {
      return 'hungry';
    } else {
      return 'cold';
    }
  }

  triggerNeed() {
    const need = this.weightedRandomSelect();

    switch (need) {
      case 'thirsty':
        this.zym.thirsty = true;
        break;
      case 'hungry':
        this.zym.hungry = true;
        break;
      case 'cold':
        this.zym.cold = true;
        break;
    }
    this.update();
    const nextInterval = this.getRandomInterval(Math.min(this.zym.thirstScale, this.zym.hungerScale, this.zym.coldnessScale));
    setTimeout(() => this.triggerNeed(), nextInterval);
  }

  update() {
    console.log('hungry: ' + this.zym.hungry);
    console.log('thirsty: ' + this.zym.thirsty);
    console.log('cold: ' + this.zym.cold);
    let randomize = Math.random();
    document.getElementById('need-fire')?.classList.add('hidden');
    document.getElementById('need-water')?.classList.add('hidden');
    document.getElementById('need-food')?.classList.add('hidden');
    this.zym.stages.forEach(stage => {
      document.getElementById(stage)?.classList.add('hidden');
    });

    if (this.zym.thirsty || this.zym.hungry || this.zym.cold) {
      if (randomize <= 0.5) {
        document.getElementById('begging')?.classList.remove('hidden');
      } else {
        document.getElementById('sad')?.classList.remove('hidden');
      }
    } else if (!this.zym.thirsty && !this.zym.hungry && !this.zym.cold) {
      document.getElementById('happy')?.classList.remove('hidden');
    } else {
      if (randomize <= 0.5) {
        document.getElementById('default')?.classList.remove('hidden');
      } else {
        document.getElementById('default2')?.classList.remove('hidden');
      }
    }
    if (this.zym.thirsty) {
      document.getElementById('need-water')?.classList.remove('hidden');
    }
    if (this.zym.cold) {
      document.getElementById('need-fire')?.classList.remove('hidden');
    }
    if (this.zym.hungry) {
      document.getElementById('need-food')?.classList.remove('hidden');
    }
  }

  forceSnow() {
    this.showElementsByClassName('flakes');
    this.showElementsByClassName('cloud');
    this.hideElementsByClassName('drops');
    document.getElementById('dimmer')?.classList.remove('hidden');
  }

  forceRain() {
    this.hideElementsByClassName('flakes');
    this.showElementsByClassName('cloud');
    this.showElementsByClassName('drops');
    document.getElementById('dimmer')?.classList.remove('hidden');
  }

  forceSun() {
    this.hideElementsByClassName('flakes');
    this.hideElementsByClassName('cloud');
    this.hideElementsByClassName('drops');
    document.getElementById('dimmer')?.classList.add('hidden');
  }

  forceClouds() {
    this.hideElementsByClassName('flakes');
    this.showElementsByClassName('cloud');
    this.hideElementsByClassName('drops');
    document.getElementById('dimmer')?.classList.remove('hidden');
  }

  hideElementsByClassName(className: string) {
    const elements = document.getElementsByClassName(className);
    Array.from(elements).forEach(element => element.classList.add('hidden'));
  }

  showElementsByClassName(className: string) {
    const elements = document.getElementsByClassName(className);
    Array.from(elements).forEach(element => element.classList.remove('hidden'));
  }

}
