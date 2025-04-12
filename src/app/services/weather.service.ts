import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WeatherForecast } from '../interfaces/wearher-forecast';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiKey = environment.openWeatherApiToken;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily';

  constructor(private http: HttpClient) {}

  getWeatherInformation(city: string): Observable<WeatherForecast | null> {
    if (!city) { return of(null); }

    const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&cnt=1&units=metric&appid=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        const forecast = response?.list?.[0];
        return {
          temperature: forecast?.temp?.day,
          condition: forecast?.weather?.[0]?.description,
          iconUrl: forecast?.weather?.[0]?.icon
            ? `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`
            : null
        } as WeatherForecast;
      }),
      catchError(err => {
        console.warn('Weather fetch failed', err);
        return of(null);
      })
    );
  }
}

